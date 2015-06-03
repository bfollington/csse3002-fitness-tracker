import pymongo as mongo

import serial_conn
import run_stats

from bson.objectid import ObjectId

"""
A class representing an individual point in a run. Each waypoint has a
GPS timestamp, as well as a latitude and longitude.
"""
class Waypoint:
    def __init__( self, time, lat, lon ):
        """
        Initialise a waypoint given the three required parameters.
        """
        self.time = time
        self.lat = lat
        self.lon = lon

    @staticmethod
    def from_mongo_obj( obj ):
        """
        Static method on the Waypoint class to construct a waypoint
        object from a stored MongoDB object.
        """
        return Waypoint( obj[ u'time' ], obj[ u'lat' ], obj[ u'lon' ] )

    def to_dict( self ):
        """
        Converts the waypoint to a standard dictionary for the front end.
        """
        return {
            "time": self.time,
            "lat": self.lat,
            "lon": self.lon
        }

"""
A class representing a run, defined by a collection of Waypoints.
"""
class Run:
    def __init__( self, waypoints ):
        """
        Construct a run given an ordered list of waypoints, and populate auto
        generated fields.
        """
        # A run cannot be created with no waypoints.
        if ( len( waypoints ) == 0 ):
            return

        # Store a reference to the passed waypoints.
        self.waypoints = waypoints

        # Calculate the start and end time from the waypoints list.
        self.start_time = self.waypoints[ 0 ].time
        self.end_time = self.waypoints[ -1 ].time

        # Does not get an ID until it is pushed to the database.
        self._id = ""

    @staticmethod
    def from_mongo_obj( obj ):
        """
        A static method to create a waypoint from a stored mongo object.
        """

        # Add all of the waypoints from the db to a new run.
        wps = []
        for wp in obj[ u'waypoints' ]:
            wps.append( Waypoint.from_mongo_obj( wp ) )

        run = Run( wps )

        # Set the metrics from the stored object.
        run.duration = obj[u'duration']
        run.distance = obj[u'distance']
        run.average_speed = obj[u'average_speed']
        run.max_speed = obj[u'max_speed']
        run.speed_graph = obj[u'speed_graph']
        run.kilojoules = obj[u'kilojoules']

        # Parse the ID from the stored object.
        run._id = str( obj[ u'_id' ] )

        return run

    def set_statistics( self, stats):
        """
        Set the statistics for the run from the provided dictionary.
        Assumes that all values exist.
        """
        self.duration = stats['duration']
        self.distance = stats['distance']
        self.average_speed = stats['average_speed']
        self.max_speed = stats['max_speed']
        self.speed_graph = stats['speed_graph']
        self.kilojoules = stats['kilojoules']

    def to_dict( self ):
        """
        Convert the run to a dictionary to be passed to the front end,
        including all metrics.
        """
        return {
            "start_time": self.start_time,
            "end_time": self.end_time,
            "waypoints": [ waypoint.to_dict() for waypoint in self.waypoints ],
            "duration": self.duration,
            "distance": self.distance,
            "average_speed": self.average_speed,
            "max_speed": self.max_speed,
            "speed_graph": self.speed_graph,
            "kilojoules": self.kilojoules
        }

"""
The datbase class which is responsible for interacting with the MongoDB
database. All interaction outside of this class is done using the Run and
Waypoint objects.
"""
class RunDatabase:
    def __init__( self ):
        # Set up the MongoDB database to use.
        self.client = mongo.MongoClient()
        self.db = self.client.fitness_tracker_development

    def clear_runs( self ):
        """
        Clear all runs stored in the database.
        """
        self.db.runs.remove()

    def delete_run( self, id ):
        """
        Remove an individual run from the database given an object ID.
        """
        self.db.runs.remove({"_id": ObjectId( id )})

    def push_run( self, run ):
        """
        Push a single Run object to the database.
        """
        run.id = self.db.runs.insert_one( run.to_dict() ).inserted_id
        return run.id

    def set_settings( self, settings ):
        """
        Set the user settings stored in the database given a dictionary
        of settings. Assumes all fields are populated. Returns True iff
        the write was successful.
        """
        try:
            to_persist = {
                "height": settings[ "height" ],
                "weight": settings[ "weight" ],
                "age": settings[ "age" ],
                "gender": settings[ "gender" ]
            }
            # Remove the existing settings and insert the new ones.
            self.db.settings.remove()
            self.db.settings.insert_one( to_persist )
            return True
        except:
            print("Invalid settings")
            return False

    def get_settings( self ):
        """
        Retrieve the settings from the database, and return them as a
        dictionary that can be passed to the front end.
        """
        try:
            settings = self.db.settings.find_one()
            to_return = {
                "height": int( settings[ u"height" ] ),
                "weight": int( settings[ u"weight" ] ),
                "age": int( settings[ u"age" ] ),
                "gender": str( settings[ u"gender" ] )
            }
            return to_return
        except:
            print("Settings not found.")

    def get_runs_since_date( self, d ):
        """
        Retrieve all runs from the database that started after the given date.
        Returns the runs if successful, or False if the read failed.
        """
        try:
            runs = self.db.runs.find({
                    "start_time": {"$gt": d}}
                ).sort("start_time")
            return [ Run.from_mongo_obj( run ) for run in runs ]

        except:
            print("No runs to return.")
            return False

    def get_latest_run( self ):
        """
        Retrieve the latest run from the database. Returns the run object
        if the read was successful, or False otherwise.
        """
        try:
            run = self.db.runs.find_one( sort = [ ( "end_time", -1 ) ] )
            return Run.from_mongo_obj( run )

        except Exception as e:
            print("Latest run not found.")
            print e
            return False

    def get_run_list( self ):
        """
        Retrieve a shallow list of all of the runs, only including their
        ID and start and end time. Can be used in conjunciton with
        get_waypoints_for to prevent loading unnecessary data on the
        front end.
        """
        runs = self.db.runs.find( {},
            { "start_time": 1, "end_time": 1 } ).sort("start_time")

        def parse_mongo_obj( obj ):
            """
            Helper method to parse a MongoDB object to extract ID,
            start and end time.
            """
            return {
                "_id": obj[ u'_id' ],
                "start_time": obj[ u'start_time' ],
                "end_time": obj[ u'end_time' ]
            }

        return [ parse_mongo_obj( run ) for run in runs ]

    def get_waypoints_for( self, id ):
        """
        Retrieve the waypoints for a given run, specified by ID.
        """
        try:
            wps = self.db.runs.find_one( {'_id': ObjectId( id ) },
                    { 'waypoints': 1 } )[ u'waypoints' ]
            return [ Waypoint.from_mongo_obj( wp ) for wp in wps ]

        except:
            print("Run not found, cannot return waypoints.")
            return False

    def get_run_with_waypoints( self, id ):
        """
        Retrieve a run object with the waypoints included, specified by run ID.
        """
        try:
            run = self.db.runs.find_one( {'_id': ObjectId( id ) } )
            return Run.from_mongo_obj( run )

        except:
            print("Full run not found.")
            return False



def demo_insert( db, path ):
    """
    A function to insert a run into the database from a file.
    Loads the file given the specified path, and stores the data
    in the given database.
    """
    # Open the file for reading
    s = serial_conn.FileSerialConnector(path)
    # run_data is a list of runs, each run is a list of waypoint tuples
    run_data = s.get_runs()

    # Get the current settings, to use to calculate statistics.
    user_settings = db.get_settings()
    height = user_settings['height']
    weight = user_settings['weight']
    age = user_settings['age']
    gender = user_settings['gender']

    # For each run in the imported data.
    for run in run_data:
        # Add each of the waypoints.
        wps = []
        for waypoint in run:
            wps.append(Waypoint(*waypoint))
        run = Run(wps)

        # Update the statistics.
        stats = run_stats.calc_statistics(wps, height, weight, age, gender)
        run.set_statistics(stats)
        # Save the run.
        db.push_run(run)

def run_tests( db ):
    """
    Clear the database, then run basic tests for each of the key methods.
    Leaves the demo files in the database so that they can be tested on the
    front end.
    """
    # Clear the runs database, if it exists
    db.clear_runs()

    # Insert some dummy data
    demo_insert( db, "samples/demo_insert.txt" )
    demo_insert( db, "samples/second_insert.txt" )

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

# If run directly, initialise the database with default settings.
if ( __name__ == "__main__" ):
    # Create a test database
    db = RunDatabase()

    db.set_settings({
        "height": 180,
        "weight": 70,
        "age": 19,
        "gender": "male"
    })
    print "Settings initialised."
    print db.get_settings()


