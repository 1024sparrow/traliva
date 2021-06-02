#!/bin/bash

dd=src/build_scripts/targets
for i in $(ls -1 $dd)
do
	if [ -d $dd/"$i" ] && [[ ! "$i" =~ ^_ ]]
	then
		echo $i
	fi
done
