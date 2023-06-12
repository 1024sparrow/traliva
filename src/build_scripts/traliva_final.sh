#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled

source $1/src/config

readonly compiled_dir="$1/$2/targets"
readonly targets_dir="$1/targets"
declare compiled
declare compiledPrev
declare init

mkdir "$compiled_dir"
mkdir "$targets_dir"
declare tempFile
if ! [ -d "$1"/compiledPrev ]
then
	mkdir "$1"/compiledPrev
fi
for i in $(ls -1 $1/src/build_scripts/targets)
do
	if [ ! -d "$1/src/build_scripts/targets/$i" ]
	then
		continue
	fi
	if [[ "$i" =~ ^_ ]]
	then
		continue
	fi
	if ! [ -d "$targets_dir"/"$i" ]
	then
		continue
	fi
	echo "Запускается скрипт генерации исходного кода под платформу \"$i\""

	compiled="$compiled_dir"/"$i"
	compiledPrev="$1"/compiledPrev/targets/"$i"
	init=false

	if ! [ -d "$compiledPrev" ]
	then
		init=true
		mkdir -p $compiledPrev
		pushd $compiledPrev
			git init -b skeleton
		popd
	fi
	$1/src/build_scripts/targets/"$i"/init.sh "$1/$2/project" "$compiled"
	pushd "$compiledPrev"
		rm -rf *
		cp -r "$compiled"/* ./
		if ! $init
		then
			tempFile=$(mktemp)
			git diff > $tempFile
			cat $tempFile > /home/boris/da/tmp/230611
			pushd "$targets_dir"/"$i"
				git apply $tempFile
			popd
			rm $tempFile
		fi
		git add . && git commit -m "traliva: skeleton changed for target \"$i\""
	popd
done
