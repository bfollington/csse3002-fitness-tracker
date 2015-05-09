#pragma once
#include <stdint.h>

#include "Adafruit_GPS.h"
#include "GPSConverter.h"

//TODO: Move definitions to .cpp. Too little code to bother with presently.
class GPSInterface {
public:
	Adafruit_GPS GPS;

public:

	GPSInterface() : GPS(&Serial1) {}
	~GPSInterface() {}

	void setup() {
		GPS.begin(9600);

		//Check firmware version
		Serial1.println(PMTK_Q_RELEASE);
	}

	//This _must_ be called as often as possible in order to use
	//the getPosition functions.
	void readSerial() {
		char c;
		do {
			//We don't care about status/etc.
			//If any of this fails, (ex: parse) there's nothing really
			//we can do about it anyway. Just ignore it and the next update
			//will clean things up.
			char c = GPS.read();
			//if (c) Serial.print(c);
			if (GPS.newNMEAreceived()) {
				GPS.parse(GPS.lastNMEA());
			}
		} while (c);
	}

	//Attempts to get the current position.
	//Returns true if a position was determined, false otherwise.
	bool getPosition(int32_t *lat, int32_t *lon) {
		//In production, the other code should be re-written to accept ints.
		char latBuff[16], lonBuff[16];
		dtostrf((double)GPS.latitude, 0, 4, latBuff);
		dtostrf((double)GPS.longitude, 0, 4, lonBuff);

		dmsToDegrees(latBuff, lonBuff, lat, lon);

		return GPS.satellites > 0 && GPS.fix != 0;
	}

	bool getPosition(float *lat, float *lon) {
		int32_t iLat, iLon;
		bool ret = getPosition(&iLat, &iLon);

		//Hemisphere correction.
		if (GPS.lat == 'S') iLat = -iLat;
		if (GPS.lon == 'E') iLon = -iLon;

		*lat = iLat / 10000000.0f;
		*lon = iLon / 10000000.0f;
		return ret;
	}

	void eraseFlash() {
		GPS.sendCommand(PMTK_LOCUS_ERASE_FLASH);
	}

	void beginLogging() {
		GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
		//For debugging only, this will be backed off later.
		GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);

		GPS.sendCommand(PMTK_LOCUS_STARTLOG);
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
