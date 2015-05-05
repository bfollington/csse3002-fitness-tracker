#include "Adafruit_GPS.h"
#include "SoftwareSerial.h"

#include "GPSConverter.h"
#include "GPSInterface.h"

int serialGetC() {
	while (!Serial1.available());

	return Serial1.read();
}

GPSInterface gps;

void setup() {
	while (!Serial);
	Serial.begin(115200);
	Serial.println("Good Morning Charlie.");
	delay(400); //Give everything time to warm up.

	gps.setup();
	gps.getData_Init();
}

bool going = true;
void loop() {
	if (!going) {
		Serial.print(".");
		delay(500);
		return;
	}

	float lat, lon;
	uint32_t timestamp;
	if (gps.getData_Next(&lat, &lon, &timestamp)) {
		Serial.print("Time: ");
		Serial.println(timestamp);

		Serial.print("Position: ");
		Serial.print(lat);
		Serial.print("|");
		Serial.println(lon);

		Serial.println("--------------------");
	} else {
		going = false;
		return;
	}
}
