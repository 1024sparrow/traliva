#!/bin/bash

#rm $1/$2/body.js
echo $1
echo $2
compile $1/$2/src/pro && mv $1/$2/compiled $1/$2.compiled && rm -rf $1/$2 && mv $1/$2.compiled $1/$2
