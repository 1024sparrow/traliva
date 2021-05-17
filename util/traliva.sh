#!/bin/bash

echo "$*" > /home/boris/traliva_hist

declare USER_SHARE=/usr/share/traliva

for i in $*
do
	if [ $i == --help ]
	then
		echo "Traliva. helper for application creation.
USAGE:
	traliva [commands] [--help]
COMMANDS:
	init
		traliva # initialize Traliva project
		bare # intialize bare project
		cmake
			qt5
HELP FOR SPECIFIED COMMAND:
	special word \"help\" at end of command line means to show help for such command only

EXAMPLES:
$ traliva init traliva
	initialize traliva project in interactive mode
$ traliva init help
	show traliva help for \"init\" command
"
		exit 0
	fi
done

declare state=0
for arg in $*
do
    if [ $arg == help ]
    then
        continue
    fi
    if [ $state == init_traliva ]
    then
        continue
    fi
	#echo "**$arg**" $state
	if [ $state == 0 ]
	then
		if [ "$arg" == init ]
		then
			state=init
		else
			state=-1
		fi
	elif [ $state == init ]
	then
		if [ "$arg" == traliva ]
		then
			state=init_traliva
		elif [ "$arg" == bare ]
		then
			state=init_bare
		elif [ "$arg" == cmake ]
		then
			state=init_cmake
		else
			state=-1
		fi
	elif [ $state == init_cmake ]
	then
		if [ "$arg" == qt5 ]
		then
			state=init_cmake_qt5
		else
			state=-1
		fi
	else
		state=-1
	fi
done
if [ $state == init_traliva ]
then
	"$USER_SHARE"/res/init-traliva.sh $*
elif [ $state == init_bare ]
then
	echo not implemented
	exit 1
elif [ $state == init_cmake_qt5 ]
then
	"$USER_SHARE"/res/traliva_init_cmake_qt5.sh
else
	echo "incorrect command. See help."
	exit 1
fi
