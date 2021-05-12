#!/bin/bash

curDir="$(pwd)"

if [ ! $(id -u) -eq 0 ]
then
	echo Run this under ROOT only!
	exit 1
fi

if [ -f /usr/local/bin/traliva ] || [ -d /usr/share/traliva ]
then
	echo "already installed. Error."
	exit 1
fi

if [ -d /usr/share/bash-completion/completions ]
then
	if [ -f /usr/share/bash-completion/completions/traliva ]
	then
		echo "such bash completion already exists. Error."
		exit 1
	fi
fi

pushd /usr/local/bin
ln -s "$curDir"/traliva.sh traliva
popd

if [ -d /usr/share/bash-completion/completions ]
then
	pushd /usr/share/bash-completion/completions
	ln -s "$curDir"/bash-completion traliva
	popd
else
	echo "bash-completions not set for traliva because of bash-completion not found on the system"
fi

mkdir /usr/share/traliva

ln -s $(pwd)/compiler/compile.js /usr/share/traliva/compile.js
ln -s $(pwd)/res /usr/share/traliva/res
