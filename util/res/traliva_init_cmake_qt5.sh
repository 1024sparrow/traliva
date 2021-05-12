#!/bin/bash

echo -n "Введите название проекта: "
read projectName &&

if [ -d $projectName ]
then
	echo "Увы. Директория с таким именем уже есть."
	exit 1
fi

mkdir -p $projectName/$projectName &&
echo "cmake_minimum_required(VERSION 3.10.2)
project(${projectName}_project CXX)

SET(CMAKE_CXX_FLAGS "$\{CMAKE_CXX_FLAGS\}" \"-lpthread\")
SET(CMAKE_CXX_STANDARD 14)

add_subdirectory($projectName)" > $projectName/CMakeLists.txt &&

echo "cmake_minimum_required(VERSION 3.10.2)

set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_AUTOMOC ON)
find_package(Qt5 REQUIRED COMPONENTS
	Widgets
)

#set(SOURCES
#	WIN32 main.cpp
#)
file(GLOB SOURCES *.cpp)
#qt5_add_resources (RCC_SOURCES rc.qrc)
add_executable($projectName "$\{SOURCES\} $\{RCC_SOURCES\}")
target_link_libraries($projectName Qt5::Core
	Qt5::Widgets
	#$<$<PLATFORM_ID:Linux>:pthread>
)
" > $projectName/$projectName/CMakeLists.txt &&

echo "#include <QCoreApplication>
#include <string.h>
#include <stdio.h>

int main(int argc, char **argv)
{
	for (int iArg = 0 ; iArg < argc ; ++iArg)
	{
		char *arg = argv[iArg];
		if (!strcmp(arg, \"--help\"))
		{
			puts(R\"(Program $projectName)\");
			return 0;
		}
		else if (arg[0] == '-')
		{
			printf(\"Unknown key \\\"%s\\\". See help.\\n\", arg);
			return 1;
		}
	}

	QCoreApplication app(argc, argv);

	//

	return app.exec();
}" > $projectName/$projectName/main.cpp &&

mkdir $projectName/build && pushd $projectName/build && cmake .. && make && popd ||
echo FAILED
