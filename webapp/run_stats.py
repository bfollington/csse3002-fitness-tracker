import datetime
import math

null = None

'''
    Calculates metabolic equivalent for the specified speed in meters per second
'''
def mps_to_mets(mps):
    mets = (0.2032 * pow(mps, 3)) - (2.1463 * mps * mps) + (10.12 * mps) - 5.9764
    if mets < 6:
        mets = 6.0
    return mets

'''
    Calculates BMR in kCal for the specified user parameters
'''
def calculate_bmr(height, weight, age, isMale):
    if (isMale):
        bmr = 66.5 + (13.75 * weight) + (5.003 * height) - (6.775 * age)
    else:
        bmr = 655.1 + (9.563 * weight) + (1.85 * height) - (4.676 * age)
    
    return bmr

    
'''
    Calculates kilocalorie consumption for the specified parameters.
    Speed is in m/s, duration in minutes, height in cm, weight in kg, age in years.
'''
def calculate_kcal_consumption(avg_speed, duration, height, weight, age, isMale):
    bmr = calculate_bmr(height, weight, age, isMale)
    mets = mps_to_mets(avg_speed)
    duration /= 60
    return bmr * (mets / 24) * duration
    
'''
    Calculates kilojoule consumption for the specified parameters.
    Speed is in m/s, duration in minutes, height in cm, weight in kg, age in years.
'''
def calculate_kj_consumption(avg_speed, duration, height, weight, age, isMale):
    return 4.1868 * calculate_kcal_consumption(avg_speed, duration, height, weight, age, isMale)

def dist(lat1, lon1, lat2, lon2):
    radius = 6371000 # Of Earth. Adjust to run on Mars.
    latDist = (lat2 - lat1) * math.pi / 180.0
    longDist = (lon2 - lon1) * math.pi / 180.0

    c = math.sin(latDist / 2)
    a = math.sin(longDist / 2)
    r = math.cos(lat1 * math.pi / 180.0) * math.cos(lat2 * math.pi / 180.0)
    l = c * c + a * a * r

    return radius * 2 * math.atan2(math.sqrt(l), math.sqrt(1 - l))
    
def calc_statistics(waypoints, height, weight, age, gender):

    dict = { }
    
    # lat, lon, time, dist, secs
    processed = []
    processed.append((waypoints[0].lat, waypoints[0].lon, waypoints[0].time, 0, 0))
    for i in range(1, len(waypoints)):
        p1 = waypoints[i - 1]
        p2 = waypoints[i]
        
        processed.append((p2.lat, p2.lon, p2.time, dist(p1.lat, p1.lon, p2.lat, p2.lon), p2.time - p1.time))
    
    totalDist = 0
    totalTime = 0
    totalKilojoules = 0
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
    
    if (gender == "male"):
        totalKilojoules = calculate_kj_consumption(totalDist / totalTime, float(totalTime) / 60, height, weight, age, True)
    elif (gender == "female"):
        totalKilojoules = calculate_kj_consumption(totalDist / totalTime, float(totalTime) / 60, height, weight, age, False)
    else:
        totalKilojoules = calculate_kj_consumption(totalDist / totalTime, float(totalTime) / 60, height, weight, age, True)
        totalKilojoules += calculate_kj_consumption(totalDist / totalTime, float(totalTime) / 60, height, weight, age, False)
        totalKilojoules /= 2
        
    dict["duration"] = totalTime
    dict["distance"] = totalDist
    dict["average_speed"] = totalDist / totalTime
    dict["max_speed"] = maxDist / maxDistTime
    dict["speed_graph"] = speedGraph
    dict["kilojoules"] = totalKilojoules
    
    return dict