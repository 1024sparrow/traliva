#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled

source $1/src/config

compiled_dir="$1/$2/targets"
targets_dir="$1/targets"
mkdir "$compiled_dir"
mkdir "$targets_dir"
declare tempFile
for i in $(ls -1 $1/src/build_scripts/targets)
do
	if [ ! -d "$1/src/build_scripts/targets/$i" ]
	then
		continue
	fi
	if [[ "$i" == _* ]]
	then
		continue
	fi
	echo "Запускается скрипт генерации исходного кода под платформу \"$i\""
	mkdir "$targets_dir"/"$i"

	pushd "$targets_dir"/"$i"
		if [ ! -d .git ]
		then
			git init
		fi
	popd

	pushd "$compiled_dir"/"$i"
		rm -r * # скрытые файлы и директории, в том чисел и .git, никуда не деваются
		$1/src/build_scripts/targets/"$i"/init.sh "$1/$2/project" "$compiled_dir"/"$i"
		tempFile=$(mktemp)
		git diff > $tempFile
		pushd "$targets_dir"/"$i"
			git apply $tempFile
		popd
		rm $tempFile
	popd

	#pushd "$compiled_dir"
	#	git clone "$1"/targets/"$i"/.git
	#	pushd "$compiled_dir"/"$i"
	#		git checkout -b skeleton
	#		git pull # если `git remote -v` не пустой
	#		rm -r * # скрытые файлы и директории, в том чисел и .git, никуда не деваются
	#		$1/src/build_scripts/targets/"$i"/init.sh "$1/$2/project" "$compiled_dir"/"$i"
	#		if ! git diff-index --quiet HEAD --
	#		then
	#			git add .
	#			git commit -m"traliva: skeleton changed for target \"$i\""
	#			git push --set-upstream origin skeleton
	#		fi
	#	popd
	#popd

	pushd "$targets_dir"/"$i"
		git stash
		git merge skeleton
		git stash pop
	popd
done
