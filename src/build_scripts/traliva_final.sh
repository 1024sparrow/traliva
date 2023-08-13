#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled (не используется)

readonly ROOT=$1

source $ROOT/src/config
source $ROOT/src/target_platforms

declare i iTarget
declare init


for i in targets compiled
do
	if ! [ -d $ROOT/$i ]
	then
		mkdir $ROOT/$i
	fi
done

for iTarget in ${targets[@]} # из файла target_platforms
do
	if [ ! -d "$1/src/build_scripts/targets/$iTarget" ]
	then
		echo "Правила сборки для платформы \"$iTarget\" не найдены. Пропускаю."
		continue
	fi
	if [ -d $ROOT/targets/$iTarget ]
	then
		init=update.sh
		echo "Обновляется статика в директории \"targets/$iTarget\""
	else
		mkdir -p $ROOT/targets/$iTarget
		init=init.sh
		echo "Генерируется код в директории \"targets/$iTarget\""
	fi
	continue # boris here: генерировать код под платформу не сразу в директорию, а во временной директории. Если скрипт сборки завершился успешно, копируем.
	if ! [ -x $ROOT/src/build_scripts/targets/$iTarget/$init ]
	then
		echo "Скрипт \"$ROOT/src/build_scripts/targets/$iTarget/$init\" отсутствует или не является исполняемым"
		echo "Под платформу \"$iTarget\" сборка пропущена"
		continue
	fi
	pushd $ROOT/compiled/targets/$iTarget > /dev/null
		echo $ROOT/src/build_scripts/targets/$iTarget/$init $ROOT/compiled/project $ROOT/compiled/targets/$iTarget && echo "Сборка под платформу $iTarget прошла успешно" || echo "Сборка под платформу $iTarget завершилась с ошибкой"
	popd > /dev/null
done



exit 0
#readonly compiled_dir="$1/$2/targets"
#readonly targets_dir="$1/targets"
#declare compiled
#declare compiledPrev
#declare init
#declare iPlatform
for iPlatform in ${targets[@]} # from 1/src/target_platforms
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
	echo "$1/src/build_scripts/targets/"$i"/init.sh \"$1/$2/project\" \"$compiled\""
	$1/src/build_scripts/targets/"$i"/init.sh "$1/$2/project" "$compiled"
	pushd "$compiledPrev"
		rm -rf *
		cp -r "$compiled"/* ./
		if ! $init
		then
			tempFile=$(mktemp)
			git diff > $tempFile
			#cat $tempFile > /home/boris/da/tmp/230611
			pushd "$targets_dir"/"$i"
				git apply $tempFile
			popd
			rm $tempFile
		fi
		git add . && git commit -m "traliva: skeleton changed for target \"$i\""
	popd
done
