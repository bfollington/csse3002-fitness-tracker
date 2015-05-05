#include <stdint.h>
#include <stdlib.h>

#include "GPSConverter.h"
#include "SoftwareSerial.h"

#define nullptr (0)

bool dmsToDegrees(const char *floraString, uint8_t leadingDegrees, int32_t *decimal);

//Returns degrees x 10,000,000. We get 7 decimal places, or an accuracy of
//roughly 11mm at the equator. The GPS gives us worse, so this shouldn't limit
//our precision.
//floraLat is of the format: 'DDMM.MMMM', floraLon is of the format 'DDDMM.MMMM'.
void dmsToDegrees(const char *floraLat, const char *floraLon, int32_t *lat, int32_t *lon) {
	dmsToDegrees(floraLat, 2, lat);
	dmsToDegrees(floraLon, 3, lon);
}

//Reads an unsigned integer from the given string, up to the given number of digits.
//Stops if it finds a null (returns current value) or if it finds a non-digit (returns -1)
int16_t readInt(const char *str, uint8_t numDigits) {
	int16_t n = 0;
	for (uint8_t i = 0; i < numDigits; i++) {
		char c = str[i];
		if (!c) {
			break;
		}

		//Check for errors.
		if (c < '0' || c > '9') {
			return -1;
		}

		n *= 10;
		n += c - '0';
	}

	return n;
}

bool dmsToDegrees(const char *floraString, uint8_t leadingDegrees, int32_t *decimal) {
	//Read the degrees portion of the string.
	int16_t degrees = readInt(floraString, leadingDegrees);
	floraString += leadingDegrees;
	*decimal = degrees;
	*decimal *= 10000000;

	if (degrees == -1) {
		return false;
	}

	//The next two digits are whole minutes.
	int16_t minutes = readInt(floraString, 2);
	floraString += 2;

	if (minutes == -1) {
		return false;
	}

	//We should now find a decimal point.
	if (*floraString != '.') {
		return false;
	}
	floraString++;

	//The 4 remaining digits are fractional minutes.
	int16_t fractionalMinutes = readInt(floraString, 4);
	if (fractionalMinutes == -1) {
		return false;
	}

	int32_t temp = minutes;
	temp *= 10000000;
	temp /= 60;
	*decimal += temp;

	temp = fractionalMinutes;
	temp *= 100;
	temp /= 6;
	*decimal += temp;

	return true;
}


int serialGetC();
static char *input = nullptr;
int putBack = 0;
void log_setDummy(char *dummy) {
	input = dummy;
}

bool lastWasStar = false;
int log_nextc() {
	if (putBack) {
		int ret = putBack;
		putBack = 0;
		return ret;
	}

	if (input != nullptr) {
		if (*input) {
			return *input++;
		} else {
			return -1;
		}
	}

	return serialGetC();
}

bool log_nextPart(char buff[32]) {
	char c;
	int i = 0;
	while (true) {
		int next = log_nextc();
		if (next == -1)
			break;

		c = (char)next;
		if (c == ',' || c == '\n' || c == '\r' || c == '*') {
			if (i == 0)
				continue;
			break;
		}

		buff[i++] = c;
	}

	buff[i] = 0;

	if (i != 0) {
		lastWasStar = c == '*';
	}

	return i != 0;
}

uint8_t log_hexVal(char c) {
	if (c >= '0' && c <= '9')
		return c - '0';
	else if (c >= 'A' && c <= 'F')
		return c - 'A' + 10;
	return 0;
}

bool log_fillLocusBuffer(char buff[32], uint8_t locus[16]) {
	for (int i = 0; i < 4; i++) {
		if (!log_nextPart(buff))
			return false;

		for (int j = 0; j < 4; j++) {
			char hexHi = buff[2 * j];
			char hexLo = buff[2 * j + 1];

			uint8_t val = log_hexVal(hexHi);
			val <<= 4;
			val |= log_hexVal(hexLo);

			locus[i * 4 + j] = val;
		}
	}

	return true;
}

bool log_getLocusEntry(uint8_t locus[16], LocusEntry *entry) {
	entry->time = *((uint32_t*)locus);
	entry->fix = locus[4];
	entry->lat = *((float*)&locus[5]);
	entry->lon = *((float*)&locus[9]);
	entry->height = *((uint16_t*)&locus[13]);
	entry->checksum = locus[15];

	uint8_t check = 0;
	for (int i = 0; i < 16; i++) {
		check ^= locus[i];
	}
	return check == 0;
}

//Destroys contents of buff. Returns runNum & logNum.
bool log_parseLogHeader(char buff[32], uint8_t *runNum, uint16_t *logNum) {
	//Skip log header, if present.
	char c = (char)log_nextc();

	if (c == '$') {
		log_nextPart(buff);
	} else {
		putBack = c;
	}

	log_nextPart(buff);
	*runNum = (uint8_t)atoi(buff);

	bool quit = lastWasStar;
	log_nextPart(buff);
	if (quit) return false;

	*logNum = (uint16_t)atoi(buff);

	return true;
}


//extern int putBack;
//extern bool lastWasStar;

//If we are starting a new run, updates runNumber (otherwise this function leave it unchanged)
//Returns true if data was returned.
bool log_getData(uint8_t *runNumber, LocusEntry *entry) {
	while (true) {
		char buff[32];

		//Skip log header, if present.
		char c = '\n';
		while (c == '\n' || c == ',' || c == '\r' || c == '*')
			c = (char)log_nextc();

		putBack = c;
		if (c == '$') {
			uint16_t logNum;
			if (!log_parseLogHeader(buff, runNumber, &logNum)) {
				return false;
			}
		}

		uint8_t locus[16];
		if (!log_fillLocusBuffer(buff, locus)) {
			return false;
		}

		//Skip checksums.
		if (lastWasStar) {
			log_nextPart(buff);
		}

		if (!log_getLocusEntry(locus, entry) || (entry->fix == 0xFF && entry->checksum == 0xFF)) {
			continue;
		}
		break;
	}

	return true;
}

