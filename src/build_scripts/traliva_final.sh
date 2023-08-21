#!/bin/bash
# Финальная сборка всего проекта. Сборка уже кода под каждую целевую платформу.

#echo $1 -- /home/boris/da/pro/traliva
#echo $2 -- compiled (не используется)

: || "
Если директория targets/<platform_id> существует,
	обновляем статику.
Иначе
	генерируем полностью проект
"

function ERROR {
	echo "Ошибка: $1"
	exit 1
}

declare ifInit

source $1/src/config || ERROR 'не удалось считать параметры сборки'
source $1/src/target_platforms || ERROR 'не удалось загрузить список целевых платформ'

for oTarget in ${targets[@]} # Список targets загружается из $1/src/target_platforms
do
	if ! [ -d $1/targets ]
	then
		mkdir $1/targets
	fi
	if [ -d $1/targets/$oTarget ]
	then
		ifInit=false
	else
		ifInit=true
		mkdir $1/targets/$oTarget
	fi
	echo "Запускается скрипт генерации исходного кода под платформу \"$oTarget\""
	if $ifInit
	then
		$1/src/build_scripts/targets/"$oTarget"/init.sh "$1/compiled/project" compiled --init
	else
		$1/src/build_scripts/targets/"$oTarget"/init.sh "$1/compiled/project" compiled --update
	fi
done
