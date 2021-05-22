#!/bin/bash
# Обработчик директории, в которой находится дочерний подпроект со своим pro-шником.
# Ожидаемая структура директории с исходниками: pro, src с исходниками.

#rm $1/$2/body.js
echo $1
echo $2
/usr/share/traliva/compile.js $1/$2/src/pro && mv $1/$2/compiled $1/$2.compiled && rm -rf $1/$2 && mv $1/$2.compiled $1/$2
