#pragma once
#include <stdint.h>

#include "Adafruit_GPS.h"
#include "GPSConverter.h"

//TODO: Move definitions to .cpp. Too little code to bother with presently.
class GPSInterface {
public:
	Adafruit_GPS GPS;

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

	void eraseFlash() {
		GPS.sendCommand(PMTK_LOCUS_ERASE_FLASH);
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

		GPS.sendCommand(PMTK_LOCUS_STOPLOG);
	}

	//Called before data can be read from the GPS Log.
	void getData_Init() {
		GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_OFF);
		
		//Discard any buffered data.
		while (Serial1.available()) {
			Serial1.read();
		}

		//TODO: Check if this is enough
		delay(80);

		GPS.sendCommand("$PMTK622,1*29");
		delay(20);

		uint8_t index = 0;
		char *str = "$PMTKLOX,1,0";
		while (str[index] != 0) {
			if (!Serial1.available()) {
				//Serial.println("Nothing");
				continue;
			}

			char c = Serial1.read();
			if (c == str[index])
				index++;
			else {
				index = 0;
				continue;
			}
		}
	}

	//Call after calling getData_Init. One Init call is needed before a group of Line calls.
	//Returns true if we retrieved data. False if no data was found (do not call this method
	//again until you've called Init again)
	bool getData_Next(float *lat, float *lon, uint32_t *timestamp) {
		uint8_t runNumber;
		LocusEntry entry;

		if (!log_getData(&runNumber, &entry)) {
			return false;
		}

		*lat = entry.lat;
		*lon = entry.lon;
		*timestamp = entry.time;
		return true;
	}
};
