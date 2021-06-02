#!/bin/bash

curDir=$(dirname "$0")
path=$(realpath $curDir)/tests/traliva_kit/index.html
if [ ! -r tests/traliva_kit/traliva ] || [ ! -r tests/traliva_kit/traliva_kit ]
then
	echo "compile components first"
	exit 1
fi

firefox --new-window file://$path
