#include <stdint.h>

#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>

#include "GPSInterface.h"

GPSInterface gps;

uint32_t timer = millis();
 
void setup() {
	Serial.begin(115200);
	Serial.println("Connected");

	gps.setup();
	delay(1000);
}


void loop() {
	gps.getData();
	
	//-------------------------------------------------------------
	//---- Stolen from demo code -- For testing/debugging only ----
	//-------------------------------------------------------------
	if (timer > millis())
		timer = millis();
	
	if (millis() - timer > 2000) { 
		timer = millis(); // reset the timer

		Serial.print("\nTime: ");
		Serial.print(GPS.hour, DEC); Serial.print(':');
		Serial.print(GPS.minute, DEC); Serial.print(':');
		Serial.print(GPS.seconds, DEC); Serial.print('.');
		Serial.println(GPS.milliseconds);
		Serial.print("Date: ");
		Serial.print(GPS.day, DEC); Serial.print('/');
		Serial.print(GPS.month, DEC); Serial.print("/20");
		Serial.println(GPS.year, DEC);
		Serial.print("Fix: "); Serial.print((int)GPS.fix);
		Serial.print(" quality: "); Serial.println((int)GPS.fixquality); 
		if (GPS.fix) {
			Serial.print("Location: ");
			Serial.print(GPS.latitude, 4); Serial.print(GPS.lat);
			Serial.print(", "); 
			Serial.print(GPS.longitude, 4); Serial.println(GPS.lon);

			Serial.print("Speed (knots): "); Serial.println(GPS.speed);
			Serial.print("Angle: "); Serial.println(GPS.angle);
			Serial.print("Altitude: "); Serial.println(GPS.altitude);
			Serial.print("Satellites: "); Serial.println((int)GPS.satellites);
		}
	}
}

