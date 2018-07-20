#!/bin/bash

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled

. $1/src/config
echo $TARGETS
echo $COMPILE_OPTIONS 

for i in $COMPILE_OPTIONS
do
    echo "-- $i"
done
