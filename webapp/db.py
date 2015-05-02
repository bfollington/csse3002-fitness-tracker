import pymongo as mongo


class Waypoint:
    def __init__( self, time, lat, lon ):
        self.time = time
        self.lat = lat
        self.lon = lon

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

    def demo_insert( self ):
        wps = []
        wps.append( Waypoint( 1, 5, 2 ) )
        wps.append( Waypoint( 2, 6, 3 ) )
        wps.append( Waypoint( 3, 7, 4 ) )

        run = Run( wps )

        self.db.runs.insert_one( run.to_dict() )

if ( __name__ == "__main__" ):
    db = RunDatabase()
    db.demo_insert()
