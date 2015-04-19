#pragma once

#include <sstream>
#include <vector>

#include <stdio.h>

struct Test {
	bool(*method)(Test *);
	const char *name;
private:
	std::ostringstream *actualOutput, *expectedOutput;

public:
	Test(bool method(Test *), const char *name)
		: method(method), name(name), actualOutput(new std::ostringstream()), expectedOutput(new std::ostringstream()) {
	}
	Test(const Test &other) = delete;
	Test(Test &&other) {
		method = other.method;
		name = other.name;
		actualOutput = other.actualOutput;
		other.actualOutput = nullptr;

		expectedOutput = other.expectedOutput;
		other.expectedOutput = nullptr;
	}

	~Test() {
		delete actualOutput;
		delete expectedOutput;
	}

	void run();

	template <typename T>
	void expect(const T &str) {
		*expectedOutput << str;
	}
	std::ostream &expected() {
		return *expectedOutput;
	}

	template <typename T>
	void actual(const T &obj) {
		*actualOutput << obj;
	}
	std::ostream &actual() {
		return *actualOutput;
	}

private:
	bool checkOutput() {
		return actualOutput->str() == expectedOutput->str();
	}
};

struct Tests {
	static std::vector<Test> *tests;
	static int registerTest(bool method(Test *), const char *name) {
		if (tests == nullptr)
			tests = new std::vector<Test>();

		tests->push_back(Test(method, name));
		return 0;
	}

	static void Run() {
		for (auto ti = tests->begin(), te = tests->end(); ti != te; ++ti) {
			Test &test = *ti;
			test.run();
		}
	}
};

#define TEST_METHOD(methodName)		\
	static bool methodName(Test *test);	\
	static int __register_ ## methodName = Tests::registerTest(&methodName, #methodName);\
	static bool methodName(Test *test)

