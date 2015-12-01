#include <stdint.h>
#include <stdlib.h>

#include "GPSConverter.h"

//--------------------------------------------------------------------
//The Adafruit GPS comes with a library to do this for us.
//Testing has shown that it is, however, unreliable and can hang waiting
//for acknowledgements that the GPS module never sends. For this reason,
//we include our own GPS data conversion routines & log reading.
//
//Many of the functions & variables in this file are not static.
//This is because we need to access them during testing to ensures
//correct functionality.
//--------------------------------------------------------------------


//This prototype is filled in Main.ino.
//It is here so that, during testing, we will find/link against the mock
//version of this function.
int serialGetC();

//Represents a single character of 'putback'/allows a single character
//look-ahead. In order to support mocking of logging (specifically) we need
//to do this manually, rather than using the Serial helper to do this.
int putBack = 0;

//During data-processing, we need to track whether the previous character
//we saw was a '*'.
bool lastWasStar = false;

//Represents the dummy input that may be provided to the logging class during
//testing.
static char *input = NULL;

//This prototype is not public. It represents the generalised version of what
//the other dmsToDegrees prototype does, allowing it to process both lat&long
//without any trouble.
bool dmsToDegrees(const char *floraString, uint8_t leadingDegrees, int32_t *decimal);

//Returns degrees x 10,000,000. We get 7 decimal places, or an accuracy of
//roughly 11mm at the equator. The GPS gives us worse, so this shouldn't limit
//our precision.
//floraLat is of the format: 'DDMM.MMMM', floraLon is of the format 'DDDMM.MMMM'.
void dmsToDegrees(const char *floraLat, const char *floraLon, int32_t *lat, int32_t *lon) {
	dmsToDegrees(floraLat, 2, lat);
	dmsToDegrees(floraLon, 3, lon);
}

//Reads an unsigned integer from the given string, up to the given number of
//digits. Stops if it finds a null (returns current value) or if it finds a
//non-digit (returns -1).
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

//See prototype.
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

//Sets the dummy input that logging will use for processing. Used for testing.
void log_setDummy(char *dummy) {
	input = dummy;
}

//This is a wrapper around the Serial function to allow us to mock input
//for the logging code easier than if we had to mock the enite serial
//conneciton.
int log_nextc() {
	if (putBack) {
		int ret = putBack;
		putBack = 0;
		return ret;
	}

	if (input != NULL) {
		if (*input) {
			return *input++;
		} else {
			return -1;
		}
	}

	return serialGetC();
}

//Retrieves the next 'part', or token, of the log data-stream.
//This will consist of all characters up to and excluding the next newline,
//comma, return, or star. (',', '\n', '\r', '*')
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

//Converts a *valid*, uppercase hex char into its numeric value.
uint8_t log_hexVal(char c) {
	if (c >= '0' && c <= '9')
		return c - '0';
	else if (c >= 'A' && c <= 'F')
		return c - 'A' + 10;
	return 0;
}

//Reads the next section of textual logging data into a binary buffer for
//parsing. We do not worry about errors/invalid data, as the checksum will
//be checked during parsing. Returns false on error.
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

//Parses the given binary data into a strongly typed struct.
//Returns false if there is a checksum error.
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
//According to the LOCUS spec, runNum should represent the 'run number'.
//However, it appears to always output run 1, until reaching the end of all
//logged runs, then returning a single '2' entry. Nevertheless, we stick to
//the spec.
bool log_parseLogHeader(char buff[32], uint8_t *runNum, uint16_t *logNum) {
	//Skip log header, if present.
	char c = (char)log_nextc();

	if (c == '$') {
		log_nextPart(buff);
	} else {
		putBack = c;
	}

	//Parse the run number
	log_nextPart(buff);
	*runNum = (uint8_t)atoi(buff);

	//There is an error if we see a star here, but we need to consume this
	//next blob anyway (as it represents a checksum).
	bool quit = lastWasStar;
	log_nextPart(buff);
	if (quit) return false;

	//The log entry-number is next.
	*logNum = (uint16_t)atoi(buff);

	return true;
}

//If we are starting a new run, updates runNumber (otherwise this function
//leaves it unchanged). Returns true if data was returned without error.
bool log_getData(uint8_t *runNumber, LocusEntry *entry) {
	//This is essentially a retry loop, which we use rather than recursion.
	//In extreme cases, recursive error recovery could cause heap corruption
	//had we chosen to recover this way.
	while (true) {
		char buff[32];

		//Skip 'preamble', if present.
		char c = '\n';
		while (c == '\n' || c == ',' || c == '\r' || c == '*')
			c = (char)log_nextc();

		//Parse a log-header, if present.
		putBack = c;
		if (c == '$') {
			uint16_t logNum;
			if (!log_parseLogHeader(buff, runNumber, &logNum)) {
				return false;
			}
		}

		//Grab the binary form of the data.
		uint8_t locus[16];
		if (!log_fillLocusBuffer(buff, locus)) {
			return false;
		}

		//Skip row checksums, these are often invalid for no reason. Honouring them
		//casues needlessly lost data. The PC will sanity check the data to catch
		//any real errors.
		if (lastWasStar) {
			log_nextPart(buff);
		}

		//We skip (rather than 'error out') invalid entries, as these are quite
		//common at the start & end of runs. We include this special case check
		//because it often has a 'valid' checksum while presenting meaningless
		//data. We also ignore entries with dummny timestamps, as the log chip
		//will often return 'blank'/erased data.
		bool invalid = !log_getLocusEntry(locus, entry);
		invalid |= (entry->fix == 0xFF && entry->checksum == 0xFF);
		invalid |= (entry->time < 1433300000 || entry->time > 2000000000);
		if (invalid) {
			continue;
		}
		break;
	}

	return true;
}

