#include "Tests.h"

#include <iostream>
#include <stdint.h>

#ifdef WINDOWS

#include <Windows.h>

void setColour(uint8_t colour) {
	SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), colour);
}

#else
//Not tested.
#include <stdlib.h>

void setColour(uint8_t colour) {
	char buff[64];
	sprintf(buff, "color %X", colour);
	system(buff);
}

#endif

std::vector<Test> *Tests::tests = nullptr;

void Test::run() {
	setColour(0x08);
	std::cout << "Test '" << name << "'... ";
	for (size_t i = strlen(name); i < 50; i++) {
		std::cout << " ";
	}

	bool passed = method(this);
	if (passed && checkOutput()) {
		setColour(0x02);
		std::cout << "Passed\n";
		setColour(0x08);
	} else {
		setColour(0x04);
		std::cout << "Failed" << (passed ? "" : " (False)") << "\n";
		setColour(0x08);

		std::cout << "Expected: '";
		setColour(0x02);
		std::cout << expectedOutput->str();
		setColour(0x08);
		std::cout << "'\n";

		std::cout << "Actual:   '";

		setColour(0x04);
		std::cout << actualOutput->str();
		setColour(0x08);

		std::cout << "'\n";
	}
}

int main(int argc, const char **argv) {
	Tests::Run();
	Sleep(100000);
}
