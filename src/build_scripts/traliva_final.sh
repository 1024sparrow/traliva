#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled

. $1/src/config
echo $TARGETS
echo $COMPILE_OPTIONS 

mode_release=false
mode_debug=false
for i in $COMPILE_OPTIONS
do
    #echo "-- $i"
    if [ $i = release ] 
    then
        #echo release detected
        mode_release=true
    elif [ $i = debug ]
    then
        #echo debug detected
        mode_debug=true
    fi
done

if [ mode_debug ]
then
    echo ddd
fi
