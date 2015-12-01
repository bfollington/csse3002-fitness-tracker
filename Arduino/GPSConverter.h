#pragma once

#include <stdint.h>

//Returns degrees x 10,000,000. We get 7 decimal places, or an accuracy of
//roughly 11mm at the equator. The GPS gives us worse, so this shouldn't limit
//our precision.
//floraLat is of the format: 'DDMM.MMMM', floraLon is of the format 'DDDMM.MMMM'.
void dmsToDegrees(const char *floraLat, const char *floraLon, int32_t *lat, int32_t *lon);

//This structure 
struct LocusEntry {
	//The UTC of this entry -- NOT GPS TIME.
	uint32_t time;
	//A 'boolean', but documented in the LOCUS spec as a 'uint8'.
	uint8_t fix;
	//The latitude & longitude of this log entry.
	float lat, lon;
	//The height above sea-level of this entry. We do not use this
	//as it is very far from stable or accurate.
	uint16_t height;
	//A checksum for this entry.
	uint8_t checksum;
};

//If we are starting a new run, updates runNumber (otherwise this function
//leaves it unchanged). Returns true if data was returned without error.
bool log_getData(uint8_t *runNumber, LocusEntry *entry);

//This is a wrapper around the Serial function to allow us to mock input
//for the logging code easier than if we had to mock the enite serial
//conneciton.
int log_nextc();

bool log_nextPart(char buff[32]);

uint8_t log_hexVal(char c);

bool log_fillLocusBuffer(char buff[32], uint8_t locus[16]);

bool log_getLocusEntry(uint8_t locus[16], LocusEntry *entry);

bool log_parseLogHeader(char buff[32], uint8_t *runNum, uint16_t *logNum);

void log_setDummy(char *dummy);
