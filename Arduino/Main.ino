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
	delay(400); //Give everything time to warm up.

	gps.setup();
}

bool connected = false;
void loop() {
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
			gps.getData_Init();

			while (gps.getData_Next(&lat, &lon, &timestamp)) {
				Serial.print(timestamp);
				Serial.print("=");
				Serial.print(lat, 5);
				Serial.print("|");
				Serial.print(lon, 5);
				Serial.print(",");
			}

			//Print our final newline.
			Serial.println();
		} else if (command == "CLEAR") {
			Serial.println("Printing info");
			
			gps.GPS.LOCUS_ReadStatus();
			Serial.println("Got.");
			
			Serial.print("Log is ");
			Serial.print(gps.GPS.LOCUS_percent);
			Serial.println("% full.");

			Serial.print(gps.GPS.LOCUS_records);
			Serial.print("|");
			Serial.print(gps.GPS.LOCUS_config);
			Serial.print("|");
			Serial.print(gps.GPS.LOCUS_interval);
			Serial.print("|");
			Serial.print(gps.GPS.LOCUS_mode);
			Serial.println();

		} else if (command == "CAPTURE") {
			//This is a debug command, so that we can 'capture' live.
			Serial.println("Starting data capture");

			gps.beginLogging();

			char *exitCommand = "STOP";
			int i = 0;
			Serial.println("Send 'STOP' to stop logging.");
			uint32_t lastTime = millis();
			while (exitCommand[i]) {
				if (Serial.available()) {
					if (Serial.read() == exitCommand[i])
						i++;
					else
						i = 0;
				}
				//Serial.print(".");
				gps.readSerial();

				uint32_t thisTime = millis();
				if (thisTime < lastTime)
					continue;  //Oh well.
				if (thisTime - lastTime > 2000) {
					lastTime += 2000;

					float lat, lon;
					if (gps.getPosition(&lat, &lon)) {
						Serial.print(lat, 6);
						Serial.print("|");
						Serial.print(lon, 6);
						Serial.println();
					}
				}
			}
			Serial.println("Stopping data capture...");
			gps.stopLogging();
			Serial.println("Stopped.");
		}
	}
}
