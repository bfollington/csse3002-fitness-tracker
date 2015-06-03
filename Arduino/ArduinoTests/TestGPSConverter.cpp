#include "Tests.h"
#include "../GPSConverter.h"

//To allow us to link
int serialGetC() { return 0; }

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

TEST_METHOD(logFile_checkSplitter) {
	log_setDummy("$PMTKLOX,1,0,0100010A,1F000000,0F000000");
	char buff[32];

	test->expect("$PMTKLOX,1,0,0100010A,1F000000,0F000000,");

	while (log_nextPart(buff)) {
		test->actual(buff);
		test->actual(",");
	}

	return true;
}

TEST_METHOD(logFile_checkLogHeader) {
	log_setDummy("$PMTKLOX,1,0,0100010A,1F000000,0F000000");
	char buff[32];
	test->expect("Run 1\nEntry 0");

	uint8_t runNum;
	uint16_t logNum;
	log_parseLogHeader(buff, &runNum, &logNum);
	test->actual() << "Run " << (int16_t)runNum << "\n" << "Entry " << logNum;

	return true;
}

TEST_METHOD(logFile_checkFillLocusBuffer) {
	log_setDummy("0100010A,1F000000,0F000000,FFEEDDEE");
	
	char buff[32];
	test->expect("0100010A1F0000000F000000FFEEDDEE");

	uint8_t locus[16];
	log_fillLocusBuffer(buff, locus);
	for (int i = 0; i < 16; i++) {
		uint8_t val = locus[i];

		char *str = "0123456789ABCDEF";
		char c1 = str[(val & 0xF0) >> 4];
		char c2 = str[(val & 0x0F)];

		test->actual(c1);
		test->actual(c2);
	}

	return true;
}

TEST_METHOD(logFile_checkGetLocusEntry) {
	log_setDummy("E6303C55,0436A2DB,C10C0A19,43F9FF6F");

	char buff[32];

	uint8_t locus[16];
	log_fillLocusBuffer(buff, locus);

	LocusEntry entry;
	log_getLocusEntry(locus, &entry);

	test->expected() << "Time:   1430008038\r\n";
	test->expected() << "Fix:    4\r\n";
	test->expected() << "Lat:    -27.4542\r\n";
	test->expected() << "Lon:    153.039\r\n";
	test->expected() << "Height: 65529\r\n";
	test->expected() << "Check:  111\r\n";

	test->actual() << "Time:   " << entry.time << "\r\n";
	test->actual() << "Fix:    " << (uint16_t)entry.fix << "\r\n";
	test->actual() << "Lat:    " << entry.lat << "\r\n";
	test->actual() << "Lon:    " << entry.lon << "\r\n";
	test->actual() << "Height: " << entry.height << "\r\n";
	test->actual() << "Check:  " << (uint16_t)entry.checksum << "\r\n";

	return true;
}

TEST_METHOD(logFile_checkFullLine) {
	log_setDummy("$PMTKLOX,1,17,"
		"E6303C55,0436A2DB,C10C0A19,43F9FF6F,"
		"F5303C55,0431A2DB,C1050A19,43ECFF67,"
		"04313C55,040DA2DB,C1F50919,43E7FF53,"
		"13313C55,04FFA1DB,C1F20919,43E1FFB4,"
		"22313C55,04FDA1DB,C1F20919,43DFFFB9,"
		"31313C55,0419A2DB,C1F70919,43DEFF49*6C");

	char buff[32];

	test->expect("Run 1\r\nEntry 17\r\n");
	uint8_t runNum;
	uint16_t logNum;
	log_parseLogHeader(buff, &runNum, &logNum);
	test->actual() << "Run " << (int16_t)runNum << "\r\n" << "Entry " << logNum << "\r\n";

	uint8_t locus[16];
	LocusEntry entry;

	char* times[] = { "1430008038", "1430008053", "1430008068", "1430008083", "1430008098", "1430008113" };
	char* positions[] = { "-27.4542|153.039", "-27.4542|153.039", "-27.4541|153.039", "-27.4541|153.039", "-27.4541|153.039", "-27.4541|153.039" };
	for (int i = 0; i < 6; i++) {
		log_fillLocusBuffer(buff, locus);
		log_getLocusEntry(locus, &entry);

		test->expected() << "Time:   " << times[i] << "\r\n";
		test->expected() << "Pos:    " << positions[i] << "\r\n";

		test->actual() << "Time:   " << entry.time << "\r\n";
		test->actual() << "Pos:    " << entry.lat << "|" << entry.lon << "\r\n";
	}

	return true;
}

TEST_METHOD(logFile_checkSimpleInterface) {
	log_setDummy("$PMTKLOX,1,73,"
		"4B443C55,040BA2DB,C18E0A19,434B0044,5A443C55,0407A2DB,C1910A19,434B0046,69443C55,04D5A1DB,C1810A19,434A00B5,"
		"78443C55,04DAA1DB,C1680A19,4345004D,87443C55,04FFA1DB,C15C0A19,434400A2,96443C55,04FEA1DB,C1580A19,434400B6*13\r\n"
		"$PMTKLOX,1,74,A5443C55,04FDA1DB,C1580A19,43430081,B4443C55,0410A2DB,C1530A19,43440072,C3443C55,0403A2DB,C1530A19,43440016,"
		"D2443C55,040FA2DB,C1540A19,4344000C,E1443C55,041BA2DB,C1540A19,4343002C,F0443C55,0406A2DB,C14B0A19,4340003C*6B");
	
	char* times[] = {
		"1430013003", "1430013018", "1430013033", "1430013048", "1430013063", "1430013078",
		"1430013093", "1430013108", "1430013123", "1430013138", "1430013153", "1430013168" };
	char* positions[] = {
		"-27.4541|153.041", "-27.4541|153.041", "-27.454|153.041", "-27.454|153.041", "-27.4541|153.04", "-27.4541|153.04",
		"-27.4541|153.04", "-27.4541|153.04", "-27.4541|153.04", "-27.4541|153.04", "-27.4542|153.04", "-27.4541|153.04" };

	LocusEntry entry;
	uint8_t runNum;
	for (int i = 0; i < 12; i++) {
		if (!log_getData(&runNum, &entry))
			return false;

		test->expected() << "Entry:  " << i << "\r\n";
		test->expected() << "Time:   " << times[i] << "\r\n";
		test->expected() << "Pos:    " << positions[i] << "\r\n";

		test->actual() << "Entry:  " << i << "\r\n";
		test->actual() << "Time:   " << entry.time << "\r\n";
		test->actual() << "Pos:    " << entry.lat << "|" << entry.lon << "\r\n";
	}

	return true;
}
