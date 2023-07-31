#!/bin/bash

pushd $(dirname $0) > /dev/null

declare DEVELOP_BRANCH
readonly INTERNALS_DIRECTORY=.task
readonly HELP="Помощник организации коллективной работы в проекте. Решает проблему конфликтов при заполнении истории изменений.
Для инициализации проекта в пустой директории запустите с ключом \"--init\". Будет инициализирован git-репозиторий.
Впоследующем запускайте без параметров: скрипт интерактивный, в зависимости от текущей ветки будут те или иные доступные действия.

Запустите с ключом --project-version для получения актуальной версии проекта.
Запустите с ключом --base-version для получения актуальной базовой версии проекта.

Версия утилиты: 7"

function initialize {
	local remoteUrl
	local i
	local mainVersion
	local mainBranch
	local taskCand
	local taskShortName

	for i in $INTERNALS_DIRECTORY tasks
	do
		rm -rf $i
		mkdir $i
	done
	git init
	read -p "Введите адрес репозитория (пустого), куда надо припарковать проект: " remoteUrl
	git remote add origin $remoteUrl
	read -p "С какой версии начнёте (Например, \"3.0\"): " mainVersion
	mainBranch=develop-v$mainVersion
	git checkout -b $mainBranch

	for i in taskVersion task taskId
	do
		touch $INTERNALS_DIRECTORY/$i
		git add $INTERNALS_DIRECTORY/$i
	done
	echo $mainVersion.0 > $INTERNALS_DIRECTORY/baseVersion
	git add $INTERNALS_DIRECTORY/baseVersion

	mkdir tasks/$mainBranch
	echo "Вводите номера задач. Для завершения ввода нажмите <Enter>, ничего не введя"
	read -p '>' taskCand
	while ! [ -z $taskCand ]
	do
		read -p 'Введите короткое имя (часть имени ветки для соответствующей задачи): ' taskShortName
		touch tasks/$mainBranch/$taskCand
		echo "$taskShortName" > tasks/$mainBranch/$taskCand.shortname
		git add tasks/$mainBranch/$taskCand tasks/$mainBranch/$taskCand.shortname
		read -p '
>' taskCand
	done

	touch changelog.md
	git add changelog.md

	git commit -m "$mainBranch: the first commit in the repository"
	git push --set-upstream origin $mainBranch
	echo READY
}



function addTasks {
	local i
	local taskCand
	local taskShortName
	local initialized=false
	for i in tasks tasks/$DEVELOP_BRANCH
	do
		if ! [ -d $i ]
		then
			mkdir $i
		fi
	done
	echo "Вводите номера задач. Для завершения ввода нажмите <Enter>, ничего не введя"
	read -p '>' taskCand
	while ! [ -z $taskCand ]
	do
		read -p 'Введите короткое имя (часть имени ветки для соответствующей задачи): ' taskShortName
		touch tasks/$DEVELOP_BRANCH/$taskCand
		echo "$taskShortName" > tasks/$DEVELOP_BRANCH/$taskCand.shortname
		git add tasks/$DEVELOP_BRANCH/$taskCand tasks/$DEVELOP_BRANCH/$taskCand.shortname
		read -p '
>' taskCand
		initialized=true
	done
	if $initialized
	then
		git commit -m "$DEVELOP_BRANCH: tasks added" &&
		git push ||
		(echo 'Произошла ошибка';exit 1)
	fi
}



function getCurrentBranch {
# Arguments:
# 1. variable store current branch name to

	if ! [ -d .git ]
	then
		echo 'вы не в репозитории...'
		exit 1
	fi

	local tmp=$(git branch | grep '*')
	tmp=${tmp:2}
	eval "$1=$tmp"
}



#function extractDevelopFromBranchName {
## Arguments:
## 1. variable to store result
## 2. source branch name
#	local major
#	local minor
#	local origIFS=$IFS
#	local i
#	local -i state=0
#
#	IFS=.
#	for i in $2
#	do
#		echo $i
#		if ! [ -z "$minor" ]
#		then
#			if [ -z "$major" ]
#			then
#				major=$minor
#			else
#				major="$major.$minor"
#			fi
#		fi
#		if [[ $i =~ ^[[:digit:]]+$ ]]
#		then
#			major="$major.$i"
#			minor=
#		else
#			minor=$i
#		fi
#	done
#	#echo "source(\"$2\") major(\"$major\"), minor(\"$minor\")"
#	IFS=$origIFS
#
#	eval $1=$major
#}



function extractDevelopFromBranchName {
# Arguments:
# 1. variable to store result
# 2. source branch name
	local major
	local minor
	local origIFS=$IFS
	local i
	local -i state=0

	IFS=.
	for i in $2
	do
		if [ $state -eq 0 ]
		then
			if [[ $i =~ ^develop-v[[:digit:]]+$ ]]
			then
				major=$i
				state=1
			else
				#eval $1=
				break
			fi
		elif [ $state -eq 1 ]
		then
			if [[ $i =~ ^[[:digit:]]+$ ]]
			then
				major="$major.$i"
			else
				#eval $1=$major
				break
			fi
		fi
	done
	#echo "source(\"$2\") major(\"$major\"), minor(\"$minor\")"
	IFS=$origIFS

	eval $1=$major
}
#extractDevelopFromBranchName qq release-2.5
#extractDevelopFromBranchName qq develop-v2.4.boris.sus
#extractDevelopFromBranchName qq develop-v2.4.boris
#extractDevelopFromBranchName qq develop-v2.4
#exit 0



function getTasks {
# Arguments:
# 1. variable store task list to
	if ! [ -d tasks/$DEVELOP_BRANCH ]
	then
		echo 'Задач нет'
		exit 1
	fi
	pushd tasks/$DEVELOP_BRANCH > /dev/null
		for i in *
		do
			if ! [[ $i =~ \.shortname$ ]]
			then
				eval "$1=(${tasks[@]} $i)"
			fi
		done
	popd > /dev/null
}



function startTask {
	local -i n=1
	local -a tasks
	local -a tasksNotStarted
	local tmp
	local newBranchName
	local line
	local taskStarted=false

	getTasks tasks
	if ! [ ${#tasks[@]} -gt 0 ]
	then
		echo 'Не найден список доступных задач'
		exit 1
	fi

	# Отсеиваем задачи, которые уже в работе
	git fetch --all
	for i in ${tasks[@]}
	do
		tmp="remotes/origin/$DEVELOP_BRANCH.HMI-$i-$(cat tasks/$DEVELOP_BRANCH/$i.shortname)"
		taskStarted=false
		while read line
		do
			if [ "$line" == "$tmp" ]
			then
				if ! [ -z $EXTRA ] # недокументированная функциональность (активируется переменной окружения EXTRA)
				then
					echo "Задача HMI-$i уже в работе"
				fi
				taskStarted=true
				break
			fi
		done <<< $(git branch --all)
		if ! $taskStarted
		then
			tasksNotStarted=(${tasksNotStarted[@]} $i)
		fi
	done

	if ! [ ${#tasksNotStarted[@]} -gt 0 ]
	then
		echo 'Задач нет'
		exit 1
	fi

	echo '
Выберите задачу:'
	for i in ${tasksNotStarted[@]}
	do
		echo "$n. https://jira.locotech-signal.ru/browse/HMI-$i ($(cat tasks/$DEVELOP_BRANCH/$i.shortname))"
		n+=1
	done
	read -p 'Ваш выбор: ' n
	if (( n > 0 )) && (( n <= ${#tasksNotStarted[@]} ))
	then
		#echo "ВАШ ВЫБОР: ${tasksNotStarted[$((n-1))]}"
		tmp=${tasksNotStarted[$((n-1))]}
		ln -s $INTERNALS_DIRECTORY/task task
		echo $tmp > $INTERNALS_DIRECTORY/taskId
		echo "Задача [Jira (HMI-$tmp)](https://jira.locotech-signal.ru/browse/HMI-$tmp)

$(cat tasks/$DEVELOP_BRANCH/$tmp)" > $INTERNALS_DIRECTORY/task
		echo 0 > $INTERNALS_DIRECTORY/taskVersion
		newBranchName="$currentBranch.HMI-$tmp-$(cat tasks/$DEVELOP_BRANCH/$tmp.shortname)"
		git checkout -b "$newBranchName" || exit 1
		git add $INTERNALS_DIRECTORY/taskVersion $INTERNALS_DIRECTORY/task $INTERNALS_DIRECTORY/taskId task &&
		git commit -m "$newBranchName: initial commit" &&
		git push --set-upstream origin $newBranchName ||
		echo "Во время операций с репозиторием произошла ошибка"
	else
		echo 'Выбор некорректен. Выхожу.'
		exit 1
	fi
}



function commitWithMinor {
	local -i currentMinorVersion=$(cat $INTERNALS_DIRECTORY/taskVersion)
	local addonComment
	local currentBranch

	if [ -z "$(git diff --cached)" ]
	then
		echo "У вас нет изменений, которые бы подлежали коммиту. Добавьте изменения под контроль сначала."
		exit 1
	fi

	getCurrentBranch currentBranch

	echo $((currentMinorVersion + 1)) > $INTERNALS_DIRECTORY/taskVersion
	git add $INTERNALS_DIRECTORY/taskVersion
	read -p 'Опциональный комментарий к коммиту: ' addonComment
	if [ -z "$addonComment" ]
	then
		addonComment="$currentBranch: ($(cat $INTERNALS_DIRECTORY/taskVersion))"
	else
		addonComment="$currentBranch: ($(cat $INTERNALS_DIRECTORY/taskVersion)) $addonComment"
	fi
	git commit -m "$addonComment"
}



function checkNocommitedChanges {
	local line

	while read line
	do
		if [ "$line" == src/station ]
		then
			echo -n
		else
			return 1
		fi
	done < <(git diff --name-only)

	return 0
}



function mergeWithDevelop {
	local -i currentMinorVersion=$(cat $INTERNALS_DIRECTORY/taskVersion)
	local currentBranch

	getCurrentBranch currentBranch

	if ! [ -z "$(git diff --cached)" ]
	then
		echo "У вас есть изменения, добавленные в очередь на коммит. Закоммитьте их или откатите изменения."
		exit 1
	elif ! checkNocommitedChanges
	then
		echo "У вас есть незакоммиченные изменения. Закоммитьте их или откатите изменения."
		exit 1
	else
		echo $((currentMinorVersion + 1)) > $INTERNALS_DIRECTORY/taskVersion
		git fetch --all && git merge --no-ff origin/${DEVELOP_BRANCH} &&
		git add $INTERNALS_DIRECTORY/taskVersion && git commit -m "$currentBranch: ($(cat $INTERNALS_DIRECTORY/taskVersion)) postmerge with $DEVELOP_BRANCH" ||
		(echo "Во время вливания \"$DEVELOP_BRANCH\" произошла ошибка";exit 1)
	fi
}



function mergeInDevelop {
	local currentBranch
	local version
	local newVersion
	local -i taskVersion
	local origIFS=$IFS
	local major
	local -i minor
	local tmpChangelog
	local tmp

	if ! [ -z $(git diff --cached) ]
	then
		echo 'У вам изменения незакоммиченные в индексе'
		exit 1
	fi

	if [ -z $(cat $INTERNALS_DIRECTORY/taskId) ]
	then
		echo 'Нечего вливать...'
		exit 1
	fi

	git fetch --all || exit 1
	git merge --no-ff origin/$DEVELOP_BRANCH || exit 1

	getCurrentBranch currentBranch

	version="$(cat $INTERNALS_DIRECTORY/baseVersion)"

	echo "version: $version"

	IFS=.
	for i in $version
	do
		if ! [ -z $minor ]
		then
			if [ -z $major ]
			then
				major=$minor
			else
				major="$major.$minor"
			fi
		fi
		minor=$i
	done
	#echo "major: \"$major\", minor: \"$minor\""
	IFS=$origIFS
	newVersion=$major.$((minor + 1))
	#echo "newVersion: \"$newVersion\""

	#echo not implemented
	#exit 1
	

	tmpChangelog=$(mktemp)
	cat changelog.md > $tmpChangelog

	echo "## [$newVersion] - $(date +%Y-%m-%d)
$(cat $INTERNALS_DIRECTORY/task)


" > changelog.md &&
	cat $tmpChangelog >> changelog.md
	rm $tmpChangelog
	echo -n > $INTERNALS_DIRECTORY/task
	echo 0 > $INTERNALS_DIRECTORY/taskVersion
	echo $newVersion > $INTERNALS_DIRECTORY/baseVersion
	tmp=tasks/$DEVELOP_BRANCH/$(cat $INTERNALS_DIRECTORY/taskId)
	echo -n > $INTERNALS_DIRECTORY/taskId
	git rm $tmp $tmp.shortname task
	echo "-- \"$DEVELOP_BRANCH\" --" # boris debug
	git add $INTERNALS_DIRECTORY/task $INTERNALS_DIRECTORY/taskVersion $INTERNALS_DIRECTORY/baseVersion $INTERNALS_DIRECTORY/taskId changelog.md &&
	git commit -m "$currentBranch: premerge" &&
	git checkout $DEVELOP_BRANCH || (echo "Произошла ошибка";exit 1)
	git merge --no-ff $currentBranch -m "$DEVELOP_BRANCH: merged with $currentBranch" &&
	git push &&
	git push origin --delete $currentBranch &&
	git branch -d $currentBranch ||
	(echo "Произошла ошибка..."; exit 1)

}



function main {
# Arguments: none

	local currentBranch
	local isInDevelop=false
	local tmp

	getCurrentBranch currentBranch
	extractDevelopFromBranchName DEVELOP_BRANCH $currentBranch
	if [ -z $DEVELOP_BRANCH ]
	then
		echo 'У вас не разработческая ветка (develop-v*). С такими данный скрипт не работает.'
		exit 1
	fi

echo "Выберите действие:"
if [ $currentBranch == $DEVELOP_BRANCH ]
then
	isInDevelop=true
	echo "
1. Приступить к задаче (выбрать задачу, создать ветку и запушить её в удалённый репозиторий)
2. Добавить новые задачи
"
	read -p "Ваш выбор: " tmp
	if [ "$tmp" == 1 ]
	then
		startTask;
	elif [ "$tmp" == 2 ]
	then
		addTasks
	else
		echo 'Действие выбрано некорректно'
		exit 1
	fi
else
	echo "
1. Сделать коммит (с автоинкрементом минорной версии). Без пуша в удалённый репозиторий.
2. Затянуть к себе \"$DEVELOP_BRANCH\"
3. Влить готовую задачу в \"$DEVELOP_BRANCH\"
"
	read -p "Ваш выбор: " tmp
	if [ "$tmp" == 1 ]
	then
		commitWithMinor
	elif [ "$tmp" == 2 ]
	then
		mergeWithDevelop
	elif [ "$tmp" == 3 ]
	then
		mergeInDevelop
	else
		echo 'Действие выбрано некорректно'
		exit 1
	fi
fi
}

function printProjectVersion {
	local -i taskVersion=$(cat .task/taskVersion)
	local state=0
	local nameShort
	local -i i
	local -i startIndex
	local -i endIndex

	while read line
	do
		if [[ "$line" =~ ^Author: ]]
		then
			for ((i=0;i<${#line};++i))
			do
				if [ $state == 0 ]
				then
					if [ "${line:$i:1}" == '<' ]
					then
						startIndex=$((i+1))
						state=1
					fi
				elif [ $state == 1 ]
				then
					if [ "${line:$i:1}" == '@' ]
					then
						endIndex=$i
						state=2
					fi
				fi
			done
			break
		fi
	done < <(git log -1)

	if [ $endIndex -lt $(($startIndex + 2)) ]
	then
		state=0 # too short email name
	fi

	if [ $state == 2 ]
	then
		nameShort=${line:$startIndex:3}
	else
		nameShort=dev
	fi

	if [ $taskVersion -gt 0 ]
	then
		echo -n "$(cat .task/baseVersion).$(cat .task/taskId).$nameShort.$(cat .task/taskVersion)"
	else
		echo -n "$(cat .task/baseVersion)"
	fi
}

for i in $*
do
	if [ $i == --help ]
	then
		echo "$HELP"
		exit 0
	fi
done

for i in $*
do
	if [ $i == --init ]
	then
		echo -n
	elif [ $i == --project-version ]
	then echo -n
	elif [ $i == --base-version ]
	then echo -n
	else
		echo "Неожиданный аргумент: \"$i\". Запустите с ключом \"--help\" для получения справки по использованию."
		exit 1
	fi
done

for i in $*
do
	if [ $i == --project-version ]
	then
		printProjectVersion
		exit 0
	fi
done

for i in $*
do
	if [ $i == --base-version ]
	then
		echo -n "$(cat .task/baseVersion)"
		exit 0
	fi
done

for i in $*
do
	if [ $i == --init ]
	then
		initialize
		exit 0
	fi
done

main

popd > /dev/null # $(dirname $0)
