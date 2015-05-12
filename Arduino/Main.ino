#include "Adafruit_GPS.h"
#include "SoftwareSerial.h"

#include "GPSConverter.h"
#include "GPSInterface.h"

#define VIB_PIN 9
#define DIST_SCALE 111319

int serialGetC() {
	while (!Serial1.available());

	return Serial1.read();
}

GPSInterface gps;
String _password = "magicunicorn";

bool connected = false;
bool first_pos = true;
bool sec_pos = true;
int distance = 0; // Distance travelled (in m)
bool long_vib = false;
int long_vib_cnt = 0;
float prevLat, prevLon;

void setup() {
	while (!Serial);
	Serial.begin(115200);
	delay(400); //Give everything time to warm up.

	// Set up Pin 9 for vibration
	pinMode(VIB_PIN, OUTPUT);
	digitalWrite(VIB_PIN, LOW);

	gps.setup();
}

void loop() {
	String command = Serial.readStringUntil('\n');
	
	if (!connected) {
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

			// Vibrate to notify start of run
			vibrateLong(2);
		}
	} else {
		if (command == "RUNDATA") {
			float lat, lon;
			uint32_t timestamp;
			gps.getData_Init();

			Serial.println("Running...");

			while (gps.getData_Next(&lat, &lon, &timestamp)) {
				Serial.print(timestamp);
				Serial.print(" = ");
				Serial.print(lat, 5);
				Serial.print(" | ");
				Serial.println(lon, 5);

				
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

// Checks the distance the device has travelled, cumulatively
// adding each time it is updated. For every kilometre travelled,
// the method will call vibrateLong with the number of kms travelled
// used as the arguments. For each half-km travelled, vibrateShort 
// is called.
void check_distance(float lat, float lon) {
	char latStr[16];
	char lonStr[16];
	int32_t latDeg; 
	int32_t lonDeg;

	// Get the lat and lon as a string
	dtostrf(lat, 0, 5, latStr);
	dtostrf(lon, 0, 5, lonStr);

	Serial.print(lat, 5);
	Serial.print(" | ");
	Serial.println(lon, 5);

	// Convert lat and lon into degrees
	dmsToDegrees(&latStr[0], &lonStr[0], &latDeg, &lonDeg);
	lat = ((float) latDeg) / 10000000;
	lat = ((float) lonDeg) / 10000000;

	if (first_pos || sec_pos) {
		// Initial coords obtained
		prevLat = lat;
		prevLon = lon;

		if (!first_pos) sec_pos = false;
		first_pos = false;
	} else {
		// New coordinates
		float delLat = (lat - prevLat);
		float delLon = (lon - prevLon);

		// Calculate distance travelled
		float dist = sqrt(pow(delLat, 2) + pow(delLon, 2));
		int intDist = (int) (dist * DIST_SCALE);
		distance += intDist;
		Serial.println("Distance travelled since last ping: " + String(intDist));

		// Check total distance travelled
		if (distance > 500) {
			if (long_vib) {
				vibrateLong(long_vib_cnt);
				long_vib_cnt++;
			} else {
				vibrateShort();
			}
			distance -= 500;
			long_vib = !long_vib;
		}

		// New coordinates are now old
		prevLat = lat;
		prevLon = lon;
	}


}

// Vibrates the device for 1 second for each time 
// of the given value.
void vibrateLong(int vibNum) {
	for (int i = 0; i < vibNum; i++) {
		digitalWrite(VIB_PIN, HIGH);
		delay(1000);
		digitalWrite(VIB_PIN, LOW);
		delay(100);
	}
}

// Vibrates the device for 0.5 seconds.
void vibrateShort() {
	digitalWrite(VIB_PIN, HIGH);
	delay(500);
	digitalWrite(VIB_PIN, LOW);
}