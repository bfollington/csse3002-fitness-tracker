#pragma once
#include <stdint.h>

#include "Adafruit_GPS.h"
#include "GPSConverter.h"

//This is a helper class to abstract away the underlying GPS.
//This allows us to mock it to a file for testing and to, if the product
//were produced, easily swap out the underlying GPS for someting cheaper.
class GPSInterface {
private:
	//Our underlying GPS, wrapped due to the many issues that the library has.
	Adafruit_GPS GPS;
	
	//Whether or not we are currently logging. This allows the consuming code
	//to call start/stop logging as often as it wants and to be more modular,
	//as it does not have to rely on previous or subsequent code to 'know'
	//the current logging state before calling start/stop logging.
	bool logging;

public:
	GPSInterface() : GPS(&Serial1) { }
	~GPSInterface() { }

	//Must be called before any other functions can be used.
	//Should only be called after the GPS has 'warmed up' for
	//a few milliseconds.
	void setup();

	//This _must_ be called as often as possible in order to use
	//the getPosition functions.
	void readSerial();

	//Attempts to get the current position from the GPS.
	//Returns true if a position was determined, false otherwise.
	bool getPosition(int32_t *lat, int32_t *lon);

	//Attempts to get the current position from the GPS.
	//Returns true if a position was determined, false otherwise.
	bool getPosition(float *lat, float *lon);

	//Erases the GPS's logging flash
	//There is a library command for this, however it is buggy and can
	//cause the device to hang.
	void eraseFlash();
	
	//If the GPS is currently not logging, begin logging.
	//There is a library command for this, however it is buggy and can
	//cause the device to hang.
	void beginLogging();

	//If the GPS is currently logging, stop logging.
	//There is a library command for this, however it is buggy and can
	//cause the device to hang.
	void stopLogging();

	//Called before data can be read from the GPS Log.
	//Returns false if no data is available due to a GPS error.
	bool getData_Init();

	//Call after calling getData_Init. One 'init' call is needed before a
	//series of 'next' calls can be made. Returns true if we retrieved data,
	//false if no data was found. (do not call this method again until you've
	//called init again)
	bool getData_Next(float *lat, float *lon, uint32_t *timestamp);
};
