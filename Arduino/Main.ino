#include "Adafruit_GPS.h"
#include "SoftwareSerial.h"

#include "GPSConverter.h"
#include "GPSInterface.h"

int serialGetC() {
	while (!Serial1.available());

	return Serial1.read();
}

GPSInterface gps;
String _password = "magicunicorn";

void setup() {
	while (!Serial);
	Serial.begin(115200);
	Serial.println("Good Morning Charlie.");
	delay(400); //Give everything time to warm up.

	gps.setup();
	gps.getData_Init();
}

bool going = true;
bool connected = false;
void loop() {
	//if (!going) {
	//	Serial.print(".");
	//	delay(500);
	//	return;
	//}


	String command = Serial.readStringUntil('\n');
	if (command.startsWith("CONNECT")) {
		//Parse password and check it against the real one
		String password = command.substring(7);
		password.trim();
		if (password != "") {
			if (password != _password) {
				Serial.print("WRONGPASS\n");
				return;
			}
		}
		connected = true;
		Serial.print("OK\n");
	}

	if (connected) {
		if (command == "RUNDATA") {
			float lat, lon;
			uint32_t timestamp;
			Serial.print("DATA:\n");

			while (true) {
				if (gps.getData_Next(&lat, &lon, &timestamp)) {
					Serial.print("Time: ");
					Serial.println(timestamp);

					Serial.print("Position: ");
					Serial.print(lat);
					Serial.print("|");
					Serial.println(lon);

					Serial.println("--------------------");
				} else {
					Serial.print(".");
					break;
				}
			}
			Serial.print("DATADONE");
			Serial.print("\n");
		}
	}

	/*if (gps.getData_Next(&lat, &lon, &timestamp)) {
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
	}*/
}
