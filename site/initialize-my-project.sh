#!/bin/bash

projectName=boris

echo -n 'Название вашего проекта (одним словом - это будет частью имён нескольких репозиториев): '
read projectName
mkdir repos
pushd repos > /dev/null
	for i in $projectName ${projectName}_kit ${projectName}_proj ${projectName}_platforms
	do
		git init --bare --shared=true $i.git
	done
popd > /dev/null

function forkSubmodules()
{
	local -a submodulesSrc=(
		src/project                https://github.com/1024sparrow/traliva_example.git
		traliva_kit                https://github.com/1024sparrow/traliva_kit.git
		src/build_scripts/targets  https://github.com/1024sparrow/traliva_platforms.git
	)
	local -i state=0
	for i in ${submodulesSrc[@]}
	do
		if [ $state -eq 0 ]
		then
			pushd $i
			state=1
		elif [ $state -eq 1 ]
		then
			git remote add parent_github $i
			git remote set-url parent_github --push "Вы не можете заливать изменения в репозиторий родительского проекта"
			echo -n "Выберите ветку исходного репозитория $i [default - master]:"
			read branchName
			if [ -z "$branchName" ]
			then
				branchName=master
			fi
			git pull parent_github "$branchName"
			git push --set-upstream origin master # master - это ветка уже вашего репозитория
			popd
			state=0
		fi
	done
}

git clone repos/${projectName}.git
pushd ${projectName} > /dev/null
	git remote add parent_github https://github.com/1024sparrow/traliva.git
	git remote set-url parent_github --push "Вы не можете заливать изменения в репозиторий родительского проекта"
	echo -n 'Выберите ветку исходного репозитория traliva. "master" или "develop": '
	read branch
	git pull parent_github $branch
	git push --set-upstream origin master # master - это ветка уже вашего репозитория

	tmpGitmodules=$(mktemp)
	while IFS= read -r line
	do
		if [[ "$line" == "	url = https://github.com/1024sparrow/traliva_example.git" ]]
		then
			echo "	url = ../${projectName}_proj.git" >> $tmpGitmodules # относительные пути. Относительно пути расположения репозитория ${projectName}.git
		elif [[ "$line" == "	url = https://github.com/1024sparrow/traliva_kit.git" ]]
		then
			echo "	url = ../${projectName}_kit.git" >> $tmpGitmodules # относительные пути. Относительно пути расположения репозитория ${projectName}.git
		elif [[ "$line" == "	url = https://github.com/1024sparrow/traliva_platforms.git" ]]
		then
			echo "	url = ../${projectName}_platforms.git" >> $tmpGitmodules # относительные пути. Относительно пути расположения репозитория ${projectName}.git
		else
			echo "$line" >> $tmpGitmodules
		fi
	done < .gitmodules
	mv $tmpGitmodules .gitmodules
	git add .gitmodules && git commit -m"First after-fork commit" && git push
	git submodule update --init
	git submodule foreach 'git checkout master'
	forkSubmodules
	echo "Сохраните ссылку на локальную документацию по вашему проекту: file://$(pwd)/doc/index.html"
popd > /dev/null
