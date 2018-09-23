#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled

. $1/src/config

compiled_dir="$1/$2/targets"
mkdir "$compiled_dir"
for i in $(ls -1 $1/src/build_scripts/targets)
do
    echo "Запускается скрипт генерации исходного кода под платформу \"$i\""
    mkdir "$compiled_dir"/"$i"
    $1/src/build_scripts/targets/"$i"/init.sh "$1/$2/project" "$compiled_dir"/"$i"
done
