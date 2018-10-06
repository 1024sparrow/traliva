#!/bin/bash

echo "Местонахождение скрипита: $0"
echo "Первый параметр: $1" # путь до директории с project
echo "Второй параметр: $2" # путь до директории, в которой нужно нагенерировать исходники проекта

DIR="$(dirname $0)" # путь, где лежит этот скрипт

cp -r "$DIR"/t/* "$2"/
cp "$1"/gameplay.js "$2"/web_content/
sed "s/#RES#/res/g" "$1"/style.css > "$2"/web_content/style.css
cp -r "$1"/res "$2"/web_content/

pushd "$DIR"
node generate.js "$1" "$2"
popd # $DIR
#pushd "$2"
#qmake-qt4 && make
#popd
