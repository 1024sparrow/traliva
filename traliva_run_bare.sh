#!/bin/bash

curDir=$(dirname "$0")
path=$(realpath $curDir)/src/project_compiled/index.html
if [ -r $path ]
then
	echo "firefox --new-window file://$path"
	firefox --new-window file://$path
else
	echo "compile bare first"
	exit 1
fi
