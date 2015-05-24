import pymongo as mongo

import serial_conn
import run_stats

from bson.objectid import ObjectId

class Waypoint:
    def __init__( self, time, lat, lon ):
        self.time = time
        self.lat = lat
        self.lon = lon

    @staticmethod
    def from_mongo_obj( obj ):
        return Waypoint( obj[ u'time' ], obj[ u'lat' ], obj[ u'lon' ] )

    def to_dict( self ):
        return {
            "time": self.time,
            "lat": self.lat,
            "lon": self.lon
        }

class Run:
    def __init__( self, waypoints ):
        # Safeguard
        if ( len( waypoints ) == 0 ):
            return

        self.waypoints = waypoints

        self.start_time = self.waypoints[ 0 ].time
        self.end_time = self.waypoints[ -1 ].time

        stats = run_stats.calc_statistics( waypoints )
        self.duration = stats['duration']
        self.distance = stats['distance']
        self.average_speed = stats['average_speed']
        self.max_speed = stats['max_speed']
        self.speed_graph = stats['speed_graph']

        # Does not get an ID until it is pushed to the database
        self._id = ""

    @staticmethod
    def from_mongo_obj( obj ):
        wps = []
        for wp in obj[ u'waypoints' ]:
            wps.append( Waypoint.from_mongo_obj( wp ) )

        run = Run( wps )
        run._id = str( obj[ u'_id' ] )

        return run

    def to_dict( self ):
        return {
            "start_time": self.start_time,
            "end_time": self.end_time,
            "waypoints": [ waypoint.to_dict() for waypoint in self.waypoints ],
            "duration": self.duration,
            "distance": self.distance,
            "average_speed": self.average_speed,
            "max_speed": self.max_speed,
            "speed_graph": self.speed_graph
        }



class RunDatabase:
    def __init__( self ):
        self.client = mongo.MongoClient()
        # Hard coded to development for now
        self.db = self.client.fitness_tracker_development

    def clear_runs( self ):
        self.db.runs.remove()

    def delete_run( self, id ):
        self.db.runs.remove({"_id": ObjectId( id )})

    def push_run( self, run ):
        run.id = self.db.runs.insert_one( run.to_dict() ).inserted_id
        return run.id

    def get_runs_since_date( self, d ):
        try:
            runs = self.db.runs.find({"start_time": {"$gt": d}}).sort("start_time")
            return [ Run.from_mongo_obj( run ) for run in runs ]

        except:
            print("No runs to return.")
            return False

    def get_latest_run( self ):

        try:
            run = self.db.runs.find_one( sort = [ ( "end_time", -1 ) ] )
            return Run.from_mongo_obj( run )

        except:
            print("Latest run not found.")
            return False


    def get_run_list( self ):
        runs = self.db.runs.find( {}, { "start_time": 1, "end_time": 1 } )

        def parse_mongo_obj( obj ):
            return {
                "_id": obj[ u'_id' ],
                "start_time": obj[ u'start_time' ],
                "end_time": obj[ u'end_time' ]
            }

        return [ parse_mongo_obj( run ) for run in runs ]

    def get_waypoints_for( self, id ):

        try:
            wps = self.db.runs.find_one( {'_id': ObjectId( id ) }, { 'waypoints': 1 } )[ u'waypoints' ]
            return [ Waypoint.from_mongo_obj( wp ) for wp in wps ]

        except:
            print("Run not found, cannot return waypoints.")
            return False

    def get_run_with_waypoints( self, id ):

        try:
            run = self.db.runs.find_one( {'_id': ObjectId( id ) } )
            return Run.from_mongo_obj( run )

        except:
            print("Full run not found.")
            return False


def demo_insert( db, path ):
    s = serial_conn.FileSerialConnector(path)
    run_data = s.get_runs()
    #run_data is a list of runs, each run is a list of waypoint tuples

    for run in run_data:
        wps = []
        for waypoint in run:
            wps.append(Waypoint(*waypoint))
        db.push_run(Run(wps))

# Simple test which clears the database, then runs some simple tests
if ( __name__ == "__main__" ):
    # Create a test database
    db = RunDatabase()

    # Clear the runs database, if it exists
    db.clear_runs()

    # Insert some dummy data
    demo_insert( db, "demo_insert.txt" )
    demo_insert( db, "demo_insert.txt" )

    # Retrieve the latest run, and print it as a dict
    print "Testing get_latest_run"
    latest_run = db.get_latest_run()
    print latest_run.to_dict()
    print ""

    # Retrieve all of the runs and print them
    runs = db.get_run_list()
    print "Testing get_run_list"
    print runs
    print ""

    # Get the waypoints for the latest run
    last_run_id = ObjectId( latest_run._id )
    print "Testing get_waypoints_for"
    # Print them as dicts, not waypoint objects
    print [ wp.to_dict() for wp in db.get_waypoints_for( last_run_id ) ]

