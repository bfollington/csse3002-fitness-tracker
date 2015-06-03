#pragma once

#include <stdint.h>

//Returns degrees x 10,000,000. We get 7 decimal places, or an accuracy of
//roughly 11mm at the equator. The GPS gives us worse, so this shouldn't limit
//our precision.
//floraLat is of the format: 'DDMM.MMMM', floraLon is of the format 'DDDMM.MMMM'.
void dmsToDegrees(const char *floraLat, const char *floraLon, int32_t *lat, int32_t *lon);

struct LocusEntry {
	uint32_t time;
	uint8_t fix;
	float lat, lon;
	uint16_t height;
	uint8_t checksum;
};

int log_nextc();

bool log_nextPart(char buff[32]);

uint8_t log_hexVal(char c);

bool log_fillLocusBuffer(char buff[32], uint8_t locus[16]);

bool log_getLocusEntry(uint8_t locus[16], LocusEntry *entry);
//Destroys contents of buff. Returns runNum & logNum.
bool log_parseLogHeader(char buff[32], uint8_t *runNum, uint16_t *logNum);

void log_setDummy(char *dummy);

bool log_getData(uint8_t *runNumber, LocusEntry *entry);
