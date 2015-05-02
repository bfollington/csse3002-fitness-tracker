import pymongo as mongo


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
        run._id = obj[ u'_id' ]

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

    def push_run( self, run ):
        run.id = self.db.runs.insert_one( run.to_dict() ).inserted_id
        return run.id

    def demo_insert( self ):
        wps = []
        wps.append( Waypoint( 1, 5, 2 ) )
        wps.append( Waypoint( 2, 6, 3 ) )
        wps.append( Waypoint( 3, 7, 4 ) )
        run = Run( wps )

        self.push_run( run )


        wps = []
        wps.append( Waypoint( 4, 5, 2 ) )
        wps.append( Waypoint( 5, 6, 3 ) )
        wps.append( Waypoint( 6, 7, 4 ) )
        run = Run( wps )

        self.push_run( run )

    def get_latest_run( self ):
        run = self.db.runs.find_one( sort = [ ( "end_time", -1 ) ] )

        return Run.from_mongo_obj( run )

if ( __name__ == "__main__" ):
    db = RunDatabase()
    #db.demo_insert()
    print db.get_latest_run().to_dict()
