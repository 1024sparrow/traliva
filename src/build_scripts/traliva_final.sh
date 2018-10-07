#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled

. $1/src/config

compiled_dir="$1/$2/targets"
targets_dir="$1/targets"
mkdir "$compiled_dir"
mkdir "$targets_dir"
for i in $(ls -1 $1/src/build_scripts/targets)
do
    echo "Запускается скрипт генерации исходного кода под платформу \"$i\""
    mkdir "$targets_dir"/"$i"

    pushd "$targets_dir"/"$i"
    if [ ! -d "$targets_dir"/"$i"/.git ]
    then
            git init
    fi
    popd

    pushd "$compiled_dir"
        git clone "$1"/targets/"$i"/.git
    popd
    #mkdir "$compiled_dir"/"$i"
    $1/src/build_scripts/targets/"$i"/init.sh "$1/$2/project" "$compiled_dir"/"$i"
done
