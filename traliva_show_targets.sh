#!/bin/bash

dd=$(dirname $0)/src/build_scripts/targets
for i in $(ls -1 $dd)
do
	if [ -d $dd/"$i" ] && [[ ! "$i" =~ ^_ ]]
	then
		echo $i
	fi
done
