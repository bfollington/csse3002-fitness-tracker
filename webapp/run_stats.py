import datetime
import math

null = None

def dist(lat1, lon1, lat2, lon2):
    radius = 6371000 # Of Earth. Adjust to run on Mars.
    latDist = (lat2 - lat1) * math.pi / 180.0
    longDist = (lon2 - lon1) * math.pi / 180.0

    c = math.sin(latDist / 2)
    a = math.sin(longDist / 2)
    r = math.cos(lat1 * math.pi / 180.0) * math.cos(lat2 * math.pi / 180.0)
    l = c * c + a * a * r

    return radius * 2 * math.atan2(math.sqrt(l), math.sqrt(1 - l))
    
def calc_statistics(waypoints):
    dict = { }
    
    # lat, lon, time, 3dist, 4secs
    processed = []
    processed.append((waypoints[0].lat, waypoints[0].lon, waypoints[0].time, 0, 0))
    for i in range(1, len(waypoints)):
        p1 = waypoints[i - 1]
        p2 = waypoints[i]
		
        processed.append((p2.lat, p2.lon, p2.time, dist(p1.lat, p1.lon, p2.lat, p2.lon), p2.time - p1.time))
    
    totalDist = 0
    totalTime = 0
    maxDist = 0
    maxDistTime = 0
    
    speedGraph = { 'x': [], 'y': [] }
    
    for data in processed:
        totalDist += data[3]
        totalTime += data[4]
        if data[3] >= maxDist:
            maxDist = data[3]
            maxDistTime = data[4]
        if data[4] != 0:
            speedGraph['x'].append(data[2] - processed[0][2])
            speedGraph['y'].append(data[3] / data[4])
    
    dict["duration"] = totalTime
    dict["distance"] = totalDist
    dict["average_speed"] = totalDist / totalTime
    dict["max_speed"] = maxDist / maxDistTime
    dict["speed_graph"] = speedGraph
    
    
    return dict
    