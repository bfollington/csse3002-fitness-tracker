#include "GPSInterface.h"

void GPSInterface::setup() {
	GPS.begin(9600);

	logging = false;
}

void GPSInterface::readSerial() {
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

bool GPSInterface::getPosition(int32_t *lat, int32_t *lon) {
	//In production, the other code should be re-written to accept ints.
	char latBuff[16], lonBuff[16];
	dtostrf((double)GPS.latitude, 0, 4, latBuff);
	dtostrf((double)GPS.longitude, 0, 4, lonBuff);

	dmsToDegrees(latBuff, lonBuff, lat, lon);

	return GPS.satellites > 0 && GPS.fix != 0;
}

bool GPSInterface::getPosition(float *lat, float *lon) {
	int32_t iLat, iLon;
	bool ret = getPosition(&iLat, &iLon);

	//Hemisphere correction.
	if (GPS.lat == 'S') iLat = -iLat;
	if (GPS.lon == 'E') iLon = -iLon;

	*lat = iLat / 10000000.0f;
	*lon = iLon / 10000000.0f;
	return ret;
}

void GPSInterface::eraseFlash() {
	GPS.sendCommand(PMTK_LOCUS_ERASE_FLASH);
}

void GPSInterface::beginLogging() {
	if (logging) return;

	GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCGGA);
	GPS.sendCommand(PMTK_SET_NMEA_UPDATE_200_MILLIHERTZ);

	GPS.sendCommand(PMTK_LOCUS_STARTLOG);

	logging = true;
}

void GPSInterface::stopLogging() {
	if (!logging) return;

	GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_OFF);

	GPS.sendCommand(PMTK_LOCUS_STOPLOG);

	logging = false;
}

bool GPSInterface::getData_Init() {
	GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_OFF);

	//Discard any buffered data.
	while (Serial1.available()) {
		Serial1.read();
	}

	//We need to give the GPS time to update.
	//Lowever values or no delays can cause the GPS to become 'confused'
	//and, in some cases, either hang or simply not 'see' the command.
	delay(80);
	GPS.sendCommand("$PMTK622,1*29");

	uint32_t startTime = millis();

	//We need to wait for the GPS to acknowledge our log request.
	//To make sure we don't hang, we timeout after 1 second of waiting.
	//In theory we should never wait more than 50 ms, so this timeout
	//is very liberal.
	uint8_t index = 0;
	char *str = "$PMTKLOX,1,0";
	while (str[index] != 0) {
		uint32_t time = millis();
		if (time - startTime > 1000) {
			return false; //Timeout
		}

		if (!Serial1.available()) {
			continue; //Wait for data to be available.
		}

		//This 'naive' string matching is good enough for us.
		//Given the string we need to match, this won't actually cause any
		//problems.
		char c = Serial1.read();
		if (c == str[index]) {
			index++;
		} else {
			index = 0;
		}
	}
	return true;
}

bool GPSInterface::getData_Next(float *lat, float *lon, uint32_t *timestamp) {
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
