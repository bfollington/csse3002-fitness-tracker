#include "Tests.h"
#include "../GPSConverter.h"

//Returns degrees x 10,000,000. We get 7 decimal places, or an accuracy of
//roughly 11mm at the equator. The GPS gives us worse, so this shouldn't limit
//our precision.
//floraLat is of the format: 'DDMM.MMMM', floraLon is of the format 'DDDMM.MMMM'.
//void dmsToDegrees(const char *floraLat, const char *floraLon, int32_t *lat, int32_t *lon);

TEST_METHOD(zero) {
	int32_t lat, lon;
	dmsToDegrees("0000.0000", "00000.0000", &lat, &lon);

	test->expect("0, 0");
	test->actual(lat);
	test->actual(", ");
	test->actual(lon);

	return true;
}

TEST_METHOD(wholeDegrees) {
	int32_t lat, lon;
	dmsToDegrees("0100.0000", "09900.0000", &lat, &lon);

	test->expect(10000000);
	test->expect(", ");
	test->expect(990000000);

	test->actual(lat);
	test->actual(", ");
	test->actual(lon);

	return true;
}

TEST_METHOD(wholeDegrees2) {
	int32_t lat, lon;
	dmsToDegrees("9900.0000", "18000.0000", &lat, &lon);

	test->expect(990000000);
	test->expect(", ");
	test->expect(1800000000);

	test->actual(lat);
	test->actual(", ");
	test->actual(lon);

	return true;
}

TEST_METHOD(degreesWholeMinutes) {
	int32_t lat, lon;
	dmsToDegrees("3011.0000", "00011.0000", &lat, &lon);

	test->expect(301833333);
	test->expect(", ");
	test->expect(1833333);

	test->actual(lat);
	test->actual(", ");
	test->actual(lon);

	return true;
}

TEST_METHOD(degreesFractionalMinutes) {
	int32_t lat, lon;
	dmsToDegrees("3011.5000", "00011.9950", &lat, &lon);

	test->expect(301916666);
	test->expect(", ");
	test->expect(1999166);

	test->actual(lat);
	test->actual(", ");
	test->actual(lon);

	return true;
}
