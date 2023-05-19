#!/bin/bash

declare projectName
declare gitpath_traliva=https://github.com/1024sparrow/traliva.git
declare gitpath_traliva_kit=https://github.com/1024sparrow/traliva_kit.git
declare gitpath_traliva_example=https://github.com/1024sparrow/traliva_example.git
declare gitpath_traliva_platforms=https://github.com/1024sparrow/traliva_platforms.git

function tuneSettings {
    local state=init
    for arg in $*
    do
        if [ $arg == help ]
        then
            echo "Generate your traliva project. By default all code copyes from traliva's github repositories.
But you can point alternate paths to them. Generate config-file with key \"--config-gen\", modify it run with that config using key \"config\"
--config-gen
    print config default content to stdout
--config <PATH>
    use config file to get actual project settings
"
            exit 0
        fi
    done

    for arg in $*
    do
        if [ $arg == --config-gen ]
        then
            echo "\
# Если указываете путь в файловой системе, то, пожалуйста, указывайте полный путь до репозитория (от корня файловой системы)
gitpath_traliva=$gitpath_traliva
gitpath_traliva_kit=$gitpath_traliva_kit
gitpath_traliva_example=$gitpath_traliva_example
gitpath_traliva_platforms=$gitpath_traliva_platforms"
            exit 0
        elif [ $arg == --config ]
        then
            state=config
        elif [ ${arg:0:1} == - ]
        then
            echo "Unknown key: \"$arg\""
            exit 1
        else
            if [ $state == config ]
            then
                if [ ! -r "$arg" ]
                then
                    echo "File \"$arg\" not found"
                    exit 1
                fi
                source "$arg"
                state=init
            fi
        fi
    done
    if [ ! $state == init ]
    then
        echo "incorrect arguments. See help."
        exit 1
    fi
}

tuneSettings $*

echo -n 'Название вашего проекта (одним словом - это будет частью имён нескольких репозиториев): '
read projectName
mkdir repos
pushd repos > /dev/null
	for i in $projectName ${projectName}_kit ${projectName}_proj ${projectName}_platforms
	do
		git init --bare --shared $i.git
	done
popd > /dev/null

function forkSubmodules()
{
	local -a submodulesSrc=(
		src/project                $gitpath_traliva_example
		traliva_kit                $gitpath_traliva_kit
		src/build_scripts/targets  $gitpath_traliva_platforms
	)
	local -i state=0
    echo "boris debug: forkSubmodules initial path: $(pwd)"
	for i in ${submodulesSrc[@]}
	do
		if [ $state -eq 0 ]
		then
			pushd $i
			state=1
		elif [ $state -eq 1 ]
		then
			git remote add parent $i
			#git remote set-url parent --push "Вы не можете заливать изменения в репозиторий родительского проекта"
			echo -n "Выберите ветку исходного репозитория $i [default - master]: "
			read branchName
			if [ -z "$branchName" ]
			then
				branchName=master
			fi
            git checkout -b "$branchName"
			git pull parent "$branchName"
			git push --set-upstream origin $branchName # master - это ветка уже вашего репозитория
			popd
			state=0
		fi
	done
}

git clone repos/${projectName}.git
pushd ${projectName} > /dev/null
	git remote add parent $gitpath_traliva
	#git remote set-url parent --push "Вы не можете заливать изменения в репозиторий родительского проекта"
	echo -n 'Выберите ветку исходного репозитория traliva. "master" или "develop": '
	read branch
    git checkout -b $branch
	git pull parent $branch
	git push --set-upstream origin $branch # master - это ветка уже вашего репозитория

	tmpGitmodules=$(mktemp)
	while IFS= read -r line
	do
		if [[ "$line" == "	url = https://github.com/1024sparrow/traliva_example.git" ]] # boris e: после всех настроек traliva: раскомментировать подлежащие строчки вместо этих, и переклонировать github в локальные репозитории
		#if [[ "$line" == "	url = $gitpath_traliva_example" ]]
		then
			echo "	url = ../${projectName}_proj.git" >> $tmpGitmodules # относительные пути. Относительно пути расположения репозитория ${projectName}.git
		elif [[ "$line" == "	url = https://github.com/1024sparrow/traliva_kit.git" ]]
		#elif [[ "$line" == "	url = $gitpath_traliva_kit" ]]
		then
			echo "	url = ../${projectName}_kit.git" >> $tmpGitmodules # относительные пути. Относительно пути расположения репозитория ${projectName}.git
		elif [[ "$line" == "	url = https://github.com/1024sparrow/traliva_platforms.git" ]]
		#elif [[ "$line" == "	url = $gitpath_traliva_platforms" ]]
		then
			echo "	url = ../${projectName}_platforms.git" >> $tmpGitmodules # относительные пути. Относительно пути расположения репозитория ${projectName}.git
		else
			echo "$line" >> $tmpGitmodules
		fi
	done < .gitmodules
	mv $tmpGitmodules .gitmodules

    echo "#!/bin/bash

PROTECTED_FILE=.gitmodules

if [ \$1 == parent ]
then
	if [ ! -z \"\$(git diff parent/$branch \${PROTECTED_FILE})\" ]
	then
		cp \${PROTECTED_FILE} .\${PROTECTED_FILE}__copy
		git checkout parent/$branch -- \${PROTECTED_FILE}
		git add \${PROTECTED_FILE}
		git commit -m\"restored ${PROTECTED_FILE} (can not change on parent remote)\"
		mv .\${PROTECTED_FILE}__copy \${PROTECTED_FILE}
	fi
fi
" > .git/hooks/pre-push
    chmod +x .git/hooks/pre-push

	git add .gitmodules && git commit -m"First after-fork commit" && git push
	git submodule update --init
	git submodule foreach 'git checkout master'
	forkSubmodules
	echo "Сохраните ссылку на локальную документацию по вашему проекту: file://$(pwd)/doc/index.html"
popd > /dev/null
