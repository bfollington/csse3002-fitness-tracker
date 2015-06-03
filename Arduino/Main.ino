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
String _password = "csse3002";

bool connected = false;
uint32_t lastTime; //For haptic notifications
int vibrateCount = 0; //Tracking small vibrations (towards a large)
uint32_t lastLogTime; //For GPS reconfiguration

#undef PI //Define PI as a float, not a double.
#define PI 3.14159265f

float cumulativeDistance = 0.0f;
//Meaningless latlon to indicate uninitialised.
float lastLat = 360, lastLon = 361;

//In meters
#define SMALL_VIBRATE_THRESHOLD	100.0f
#define LARGE_VIBRATE_COUNT 5 //The number of small vibrations that will be equal to a large vibration.

#define COMMAND_COUNT 6
#define MAX_COMMAND_LENGTH 10
char *commands[] = {
	"CONNECT ",
	"RUNDATA\n",
	"CLEAR\n",
	"CAPTURE\n",
	"OK\n",
	"VIBRATE\n"
};
char serialBuff[10];
int serialBuffi = 0;

void setup() {
	//while (!Serial);
	Serial.begin(115200);
	delay(400); //Give everything time to warm up.

	// Set up Pin 9 for vibration
	pinMode(VIB_PIN, OUTPUT);
	digitalWrite(VIB_PIN, LOW);

	lastLogTime = lastTime = millis();

	for (int i = 0; i < MAX_COMMAND_LENGTH; i++) {
		serialBuff[i] = 0;
	}

	gps.setup();

	vibrateDelay(3000);
}

int matchCommand() {
	while (Serial.available()) {
		int c = Serial.read();
		serialBuff[serialBuffi++] = (char)c;
		serialBuffi %= MAX_COMMAND_LENGTH;

		//Now try to match a command.
		for (int i = 0; i < COMMAND_COUNT; i++) {
			//Try to match commands[i].
			char *command = commands[i];
			for (int j = 0; j < MAX_COMMAND_LENGTH; j++) {
				//Start at every possible index.
				for (int k = 0; k < MAX_COMMAND_LENGTH; k++) {
					if (command[k] == 0) {
						//Matched
						for (int l = 0; l < MAX_COMMAND_LENGTH; l++) {
							serialBuff[l] = 0;
						}
						return i + 1;
					}

					if (serialBuff[(j + k) % MAX_COMMAND_LENGTH] != command[k]) {
						break;
					}
				}
			}
		}
	}
	return 0;
}

void processRundata() {
	gps.stopLogging();

	float lat, lon;
	uint32_t timestamp;
	if (!gps.getData_Init()) {
		Serial.println();
		return;
	}

	while (gps.getData_Next(&lat, &lon, &timestamp)) {
		Serial.print(timestamp);
		Serial.print("=");
		Serial.print(lat, 5);
		Serial.print("|");
		Serial.print(lon, 5);
		Serial.print(",");
	}
	gps.readSerial();

	//Print our final newline.
	Serial.println();
}

void processCapture() {
	gps.stopLogging();
	
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
			updateDistance();
			giveHapticFeedback();
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

float calcDist(float lat1, float lon1, float lat2, float lon2) {
	//Calculations are slow.
	gps.readSerial();

	const float radius = 6371000; //Of Earth. Adjust to run on Mars.
	float latDist = (lat2 - lat1) * PI / 180.0f;
	float longDist = (lon2 - lon1) * PI / 180.0f;

	float c = sinf(latDist / 2);
	float a = sinf(longDist / 2);
	float r = cosf(lat1 *  PI / 180.0) * cosf(lat2 * PI / 180.0);
	float l = c * c + a * a * r;

	gps.readSerial();

	return radius * 2 * atan2f(sqrtf(l), sqrtf(1 - l));
}

void updateDistance() {
	float lat, lon;
	if (!gps.getPosition(&lat, &lon))
		return;

	if (lastLat != 360 || lastLon != 361) {
		cumulativeDistance += calcDist(lat, lon, lastLat, lastLon);
	}

	lastLat = lat;
	lastLon = lon;
}

void giveHapticFeedback() {
	if (cumulativeDistance > SMALL_VIBRATE_THRESHOLD) {
		int count = 0;
		while (cumulativeDistance > SMALL_VIBRATE_THRESHOLD) {
			cumulativeDistance -= SMALL_VIBRATE_THRESHOLD;
			count++;
		}
		vibrateCount += count;
		if (vibrateCount > LARGE_VIBRATE_COUNT) {
			vibrateLong(2);
			vibrateCount -= LARGE_VIBRATE_COUNT;
		} else {
			vibrateShort();
		}
	}
}

void loop() {
	gps.readSerial();
	gps.beginLogging();

	int command = matchCommand();
	String password;
	switch (command) {
		case 1: //Connect
			gps.stopLogging();

			//Parse password and check it against the real one
			password = Serial.readStringUntil('\n');
			password.trim();
			if (_password != "") {
				if (password != _password) {
					Serial.print("WRONGPASS\n");
					return;
				}
			}
			connected = true;
			Serial.print("OK\n");
			break;
		case 2: //Rundata
			if (!connected) break;
			processRundata();
			break;
		case 3: //Clear
			if (!connected) break;
			gps.stopLogging();
			gps.eraseFlash();
			Serial.print("OK\n");
			break;
		case 4: //Capture
			if (!connected) break;
			processCapture();
			break;
		case 5: //OK
			Serial.print("OK\n");
			break;
		case 6: //Vibrate
			Serial.print("OK\n");
			vibrateLong(10);
			break;
		default:
			break;
	}

	uint32_t time = millis();
	if (time - lastTime > 1000) {
		float lat, lon;
		if (gps.getPosition(&lat, &lon)) {
			//Serial.println(cumulativeDistance);
		} else {
			//Serial.print("!");
		}

		updateDistance();
		giveHapticFeedback();
		lastTime = time - 1;
	}

	if (time - lastLogTime > 65000) {
		lastLogTime -= 65000;
		//gps.stopLogging();
		//gps.beginLogging();
	}
}

void vibrateDelay(int ms) {
	unsigned long stop = millis() + ms;
	while (millis() < stop) {
		gps.readSerial();
	}
}

// Vibrates the device for 1 second for each time 
// of the given value.
void vibrateLong(int vibNum) {
	//Serial.println("VibrateLong");
	for (int i = 0; i < vibNum; i++) {
		digitalWrite(VIB_PIN, HIGH);
		vibrateDelay(1000);
		digitalWrite(VIB_PIN, LOW);
		vibrateDelay(100);
	}
}

// Vibrates the device for 0.5 seconds.
void vibrateShort() {
	//Serial.println("VibrateShort");
	digitalWrite(VIB_PIN, HIGH);
	vibrateDelay(500);
	digitalWrite(VIB_PIN, LOW);
}
