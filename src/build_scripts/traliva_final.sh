#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled (не используется)

readonly ROOT=$1

declare i iTarget tmpDir
declare init

function ERROR {
	if ! [ -z "$iTarget" ]
	then
		echo "Ошибка сборки под платформу $iTarget: $1"
	else
		echo "Ошибка: $1"
	fi
	if ! [ -z "$tmpDir" ]
	then
		rm -rf $tmpDir
	fi
	exit 0
}

source $ROOT/src/config || ERROR 'не удалось считать параметры сборки'
source $ROOT/src/target_platforms || ERROR 'не удалось загрузить список целевых платформ'


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
	tmpDir=$(mktemp -d)
	if [ -d $ROOT/targets/$iTarget ]
	then
		cp -rf $ROOT/targets/$iTarget $tmpDir/ || ERROR 1
		#rm -rf $ROOT/targets/$iTarget || ERROR 2
		init=--update
		echo "Обновляется статика в директории \"targets/$iTarget\""
	else
		init=--init
		echo "Генерируется код в директории \"targets/$iTarget\""
	fi
	if ! [ -x $ROOT/src/build_scripts/targets/$iTarget/init.sh ]
	then
		echo "Скрипт \"$ROOT/src/build_scripts/targets/$iTarget/init.sh\" отсутствует или не является исполняемым"
		echo "Под платформу \"$iTarget\" сборка пропущена"
		continue
	fi
	pushd $tmpDir > /dev/null
		if ! [ -d $iTarget ]
		then
			mkdir $iTarget
		fi
		$ROOT/src/build_scripts/targets/$iTarget/init.sh \
			$init \
			$ROOT/compiled/project \
			$tmpDir/$iTarget &&
		echo "Сборка под платформу $iTarget прошла успешно" ||
		ERROR "Сборка под платформу $iTarget завершилась с ошибкой"
	popd > /dev/null
	mkdir -p $ROOT/targets
	rm -rf $ROOT/targets/$iTarget
	cp -rf $tmpDir/$iTarget $ROOT/targets/$iTarget ||
		ERROR 'Не удалось скопировать результат сборки'
done
