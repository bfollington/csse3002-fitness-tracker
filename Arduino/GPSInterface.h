#pragma once
#include <stdint.h>

#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>

 //TODO: Move definitions to .cpp. Too little code to bother with presently.
class GPSInterface {
private:
	Adafruit_GPS GPS;
public:
	GPSInterface() : GPS(&Serial1) {}
	~GPSInterface() {}
	
	void setup() {
		GPS.begin(9600);
		
		//Check firmware version
		Serial1.println(PMTK_Q_RELEASE);
	}
	
	//Attempts to get the current position.
	//Returns true if a position was determined, false otherwise.
	bool getPosition(int32_t *lat, int32_t *lon) {
		//FIXME: Until I can get a signal, I can't really write this.
		//It's a thin wrapper around the helper functions found in the .cpp for this header.
		return false;
	}
	
	void beginLogging() {
		GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
		//For debugging only, this will be backed off later.
		GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);
		
		if (!GPS.LOCUS_StartLogger()) {
			Serial.println("WARNING: NO RESPONSE RECEIVED TO STARTLOGGING REQUEST.");
		}
	}
	
	void stopLogging() {
		GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_OFF);
	}
	
	//Called before data can be read from the GPS Log.
	void getData_Init() {
		GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_OFF);
		
		//Discard any buffered data.
		while (Serial1.available()) {
			Serial1.read();
		}
		
		//TODO: Check if this is enough
		delay(300);
		
		GPS.sendCommand("$PMTK622,1*29");
	}
	
	//Call after calling getData_Init. One Init call is needed before a group of Line calls.
	//Returns true if we retrieved data. False if no data was found (do not call this method
	//again until you've called Init again)
	bool getData_Next(int32_t *lat, int32_t *lon, uint32_t *timestamp) {
		//TODO: Find out what an 'end of log' looks like.
		//This is just a thin wrapper around GPSConverter.h.
	}
};
