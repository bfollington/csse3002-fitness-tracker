#include "Adafruit_GPS.h"
#include "SoftwareSerial.h"

#include "GPSConverter.h"
#include "GPSInterface.h"

#define VIB_PIN 9

int serialGetC() {
	while (!Serial1.available());

	return Serial1.read();
}

GPSInterface gps;
bool going = true;
bool connected = false;
String _password = "magicunicorn";
float distance = 0; // Distance travelled (in m)

void setup() {
	while (!Serial);
	Serial.begin(115200);
	Serial.println("Good Morning Charlie.");
	delay(400); //Give everything time to warm up.

	// Set up Pin 9 for vibration
	pinMode(VIB_PIN, OUTPUT);
	digitalWrite(VIB_PIN, LOW);

	// Setup GPS
	gps.setup();
	gps.getData_Init();
	Serial.println("Running!!");
}

void loop() {
	//if (!going) {
	//	Serial.print(".");
	//	delay(500);
	//	return;
	//}

	// Vibrate to notify start of run
	digitalWrite(VIB_PIN, HIGH);
	delay(1000);
	digitalWrite(VIB_PIN, LOW);
	delay(100);
	digitalWrite(VIB_PIN, HIGH);
	delay(1000);
	digitalWrite(VIB_PIN, LOW);

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
			float lat, lon, prevLat, prevLon;
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

					// Check for previous coordinates
					if ((prevLat == 0.0F) && (prevLon == 0.0F)) {
						// Initial coords obtained
						prevLat = lat;
						prevLon = lon;
					} else {
						// New coordinates
						float delLat = lat - prevLat;
						float delLon = lon - prevLon;

						// Calculate distance travelled
						float dist = sqrt(pow(delLat, 2) + pow(delLon, 2));
						Serial.println("Distance travelled since last ping: " + String(dist));
						distance += dist;

						// Distance as an integer
						int intDist = (int) distance;
						Serial.println("Distance travelled since last ping (int): " + String(intDist));

						// Check total distance travelled
						if ((intDist % 500) == 0) {
							// Check if 500m or 1km milestones travelled
							int milestone = intDist / 500;
							if ((milestone % 2) == 0) {
								// 1km-type milestone reached - vibrate
								int kmNum = milestone / 2;
								for (int i = 0; i <= kmNum; i++) {
									digitalWrite(VIB_PIN, HIGH);
									delay(1000);
									digitalWrite(VIB_PIN, LOW);
									delay(100);
								}
							} else {
								// 500m-type milestone reached - vibrate
								int halfKMNum = milestone / 3;
								for (int i = 0; i <= halfKMNum; i++) {
									digitalWrite(VIB_PIN, HIGH);
									delay(500);
									digitalWrite(VIB_PIN, LOW);
									delay(100);
								}
							}
						}

						// New coordinates are now old
						prevLat = lat;
						prevLon = lon;
					}
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
