#!/bin/bash

for oArg in $@
do
	if [ "$oArg" == --help ]
	then
		echo "
Процесс генерации проекта следующий:

1. Генерирация конфигурационного файла проекта.
$0 --config-gen > путь/по/которому/создать/кофигурационный/файл

2. Правим конфигурационный файл в текстовом редакторе. Предполагатся, что один или несколько репозиториев разработчик (дабы не публиковать свои разработки!) форкает в свои собственные репозитории. Если разработчик указывает свои репозитории, то он должен позаботиться о том, чтобы эти репозитории существовали.

3. Инициализируем Проект.
$0 --config <путь/до/конфига>
"
		exit 0
	fi
done

declare state=init
declare argConfigPath

function ERROR {
	echo "Ошибка: $1"
	exit 1
}
function fErrorArg {
	echo "неожиданный аргумент: \"$1\". См. справку."
}

for oArg in $@
do
	if [ $state == init ]
	then
		if [ "$oArg" == --config-gen ]
		then
			state=configGen.ready
		elif [ "$oArg" == --config ]
		then
			state=config.init
		elif [ "$oArg" == traliva ] || [ "$oArg" == init ]
		then
			echo -n
		else
			fErrorArg "$oArg"
		fi
	elif [ $state == config.init ]
	then
		argConfigPath="$oArg"
		state=config.ready
	else
		ERROR 'лишние параметры указаны. См. справку.'
	fi
done

function cloneRepo {
# Arguments:
# 1. codePath
# 2. repositoryForkFrom
# 3. repositoryPushTo
# 4. branch

	local argCodePath="$1"
	local argRepoForkFrom="$2"
	local argRepoPushTo="$3"
	local argBranch="$4"

#	echo "
#	argCodePath=$argCodePath
#	argRepoForkFrom=$argRepoForkFrom
#	argRepoPushTo=$argRepoPushTo
#	argBranch=$argBranch
#"

	if [ -z "$argCodePath" ]
	then
		git clone "$argRepoForkFrom" "$dirName" --branch "$argBranch" || ERROR boris\ 0
	else
		pushd "$dirName"
			git submodule set-url "$argCodePath" "$argRepoForkFrom" || ERROR boris\ 1
			git submodule update --init "$argCodePath" || ERROR boris\ 2
			pushd "$argCodePath"
				git checkout "$argBranch" || ERROR boris\ 3
			popd
			if ! [ "$argRepoForkFrom" == "$argRepoPushTo" ]
			then
				git submodule set-url "$argCodePath" "$argRepoPushTo" || ERROR boris\ 4
				git submodule init "$argCodePath" || ERROR boris\ 5
			fi
		popd
	fi
}

if [ $state == configGen.ready ]
then
	echo "// nodejs module

module.exports = {
	gitSubmodules:[
		{
			codePath: '',
			repositoryForkFrom: 'https://github.com/1024sparrow/traliva.git',
			repositoryPushTo: 'https://github.com/1024sparrow/traliva.git',
			branch: 'develop-v2.2'
		},
		{
			codePath: 'traliva_kit',
			repositoryForkFrom: 'https://github.com/1024sparrow/traliva_kit.git',
			repositoryPushTo: 'https://github.com/1024sparrow/traliva_kit.git',
			branch: 'develop-v2.2'
		},
		{
			codePath: 'src/project',
			repositoryForkFrom: 'https://github.com/1024sparrow/traliva_example.git',
			repositoryPushTo: 'https://github.com/1024sparrow/traliva_example.git',
			branch: 'develop-v2.2'
		},
		{
			codePath: 'src/build_scripts/targets',
			repositoryForkFrom: 'https://github.com/1024sparrow/traliva_platforms.git',
			repositoryPushTo: 'https://github.com/1024sparrow/traliva_platforms.git',
			branch: 'develop-v2.2'
		},
	]
};"
elif [ $state == config.ready ]
then
	declare codePath
	declare repositoryForkFrom
	declare repositoryPushTo
	declare branch

	read -p 'Как назвать директорию: ' dirName
	state=codePath
	while read line
	do
		#echo "$line"
		#if [ -z "$line" ]
		#then
		#	continue
		#fi
		if [ $state == codePath ]
		then
			codePath="$line"
			state=repositoryForkFrom
		elif [ $state == repositoryForkFrom ]
		then
			repositoryForkFrom="$line"
			state=repositoryPushTo
		elif [ $state == repositoryPushTo ]
		then
			repositoryPushTo="$line"
			state=branch
		elif [ $state == branch ]
		then
			branch="$line"
			state=codePath
			cloneRepo "$codePath" "$repositoryForkFrom" "$repositoryPushTo" "$branch"
		fi
	done < <(node /usr/share/traliva/res/readConfig.js --list-git-submodules "$argConfigPath" || ERROR 'Не удалось получить список адресов репозиториев')

	echo -n "Сохраните ссылку на локальную документацию по вашему проекту: file://"
	readlink -f "$dirName"/doc/index.html
else
	ERROR 'Не хватает аргументов. См. справку.'
fi
