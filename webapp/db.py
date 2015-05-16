import pymongo as mongo

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
            "waypoints": [ waypoint.to_dict() for waypoint in self.waypoints ]
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


    def get_latest_run( self ):

        try:
            run = self.db.runs.find_one( sort = [ ( "end_time", -1 ) ] )
            return Run.from_mongo_obj( run )

        except:
            print("Run not found.")
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
            print("Run not found.")
            return False

    def get_run_with_waypoints( self, id ):

        try:
            run = self.db.runs.find_one( {'_id': ObjectId( id ) } )
            return Run.from_mongo_obj( run )

        except:
            print("Run not found.")
            return False


def demo_insert( db ):
    wps = []
    wps.append( Waypoint( 1, 5, 2 ) )
    wps.append( Waypoint( 2, 6, 3 ) )
    wps.append( Waypoint( 3, 7, 4 ) )
    run = Run( wps )

    db.push_run( run )

    wps = []
    wps.append( Waypoint( 4, 5, 2 ) )
    wps.append( Waypoint( 5, 6, 3 ) )
    wps.append( Waypoint( 6, 7, 4 ) )
    run = Run( wps )

    db.push_run( run )

# Simple test which clears the database, then runs some simple tests
if ( __name__ == "__main__" ):
    # Create a test database
    db = RunDatabase()

    # Clear the runs database, if it exists
    db.clear_runs()

    # Insert some dummy data
    demo_insert( db )

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

