#include <stdint.h>

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



