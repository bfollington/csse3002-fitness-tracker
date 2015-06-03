#include "Adafruit_GPS.h"
#include "SoftwareSerial.h"

#include "GPSConverter.h"
#include "GPSInterface.h"

//The vibration pin
#define VIB_PIN 9

//Our GPS interface, to allow this code to be a bit more GPS agnostic.
GPSInterface gps;

//The current password. This is hardcoded here for ease of development. This
//is deemed acceptable for a proof-of-concept development prototype, as it 
//shows where password checking would take place and how it would be presented
//to the user. In production, this would be stored in EEPROM and be changable.
String _password = "csse3002";

//Whether or not a computer is connected & authenticated
bool connected = false;

//The last time we checked if we should provide haptic feedback.
uint32_t lastTime;

//The number of small vibrations we have done since the last large vibration.
int vibrateCount = 0;

#undef PI //Define PI as a float, not a double.
#define PI 3.14159265f

//The cumulative distance since we last vibrated.
float cumulativeDistance = 0.0f;

//These are used to track our last know position, for determinining the
//distance we have travelled since we last checked. This is used for haptic
//feedback. Meaningless latlon to indicate uninitialised.
float lastLat = 360, lastLon = 361;

//The cumulative distance between small vibrations.
#define SMALL_VIBRATE_THRESHOLD	100.0f

//The number of small vibrations that will be equal to a large vibration.
#define LARGE_VIBRATE_COUNT 5

//The number of commands in the list below
#define COMMAND_COUNT 6

//The maximum length of a command below
#define MAX_COMMAND_LENGTH 10

//The commands we will accept, including their terminator to indicate if they
//accept an argument or are required to be followed by a newline.
char *commands[] = {
	"CONNECT ", //Connect & check password
	"RUNDATA\n", //Retrieve run data
	"CLEAR\n", //Erase run data
	"CAPTURE\n", //Begin a debug data capture
	"OK\n", //Echo ok
	"VIBRATE\n" //Test vibration.
};

//A circular buffer used to hold incoming serial data as we match commands.
char serialBuff[MAX_COMMAND_LENGTH];

//The next index in serialBuff to use.
int serialBuffi = 0;

//This is provided to allow us to mock it out during testing, or alternatively
//have a centalised place to add in serial echo or other processing. If we did
//not use this in the places we do, we would have to paste changes multiple
//times to get the desired behaviour.
int serialGetC() {
	while (!Serial1.available());

	return Serial1.read();
}

void setup() {
	Serial.begin(115200);

	delay(400); //Give the GPS time to warm up.
	gps.setup();

	// Set up Pin 9 for vibration
	pinMode(VIB_PIN, OUTPUT);
	digitalWrite(VIB_PIN, LOW);

	lastTime = millis();

	for (int i = 0; i < MAX_COMMAND_LENGTH; i++) {
		serialBuff[i] = 0;
	}

	//Give everything time to 'warm up', including the GPS now that
	//it is initialised.
	vibrateDelay(3000);
}

//Attempts to match an incoming command from a connected computer. Returns 0 if
//no command was matched, or the 1-based index of the matched command if one
//was matched. (So commands[i-1] is the text of the matched command)
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

//Processes a 'RUNDATA' command.
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

//Processes a debug 'CAPTURE' command.
void processCapture() {
	gps.stopLogging();
	delay(50);

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

//Returns the distance, in meters, between the two given points.
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

//Updates the cumulative distance travelled for haptic feedback notifications.
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

//Provides, if required, haptic feedback based on the current cumulative
//distance.
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

	//There is no harm in calling this as many times as we want.
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
	//Only update distance calculations for haptic feedback every 5 seconds.
	if (time - lastTime > 5000) {
		updateDistance();
		giveHapticFeedback();
		lastTime = time - 1;
	}
}

//A custom delay function used by haptic feedback to ensure that the GPS
//serial does not get left behind.
void vibrateDelay(int ms) {
	unsigned long stop = millis() + ms;
	while (millis() < stop) {
		gps.readSerial();
	}
}

//Vibrates the device for 1 second, vibNum times.
void vibrateLong(int vibNum) {
	for (int i = 0; i < vibNum; i++) {
		digitalWrite(VIB_PIN, HIGH);
		vibrateDelay(1000);
		digitalWrite(VIB_PIN, LOW);
		vibrateDelay(100);
	}
}

//Vibrates the device for 0.5 seconds.
void vibrateShort() {
	digitalWrite(VIB_PIN, HIGH);
	vibrateDelay(500);
	digitalWrite(VIB_PIN, LOW);
}
