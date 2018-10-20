#!/bin/bash

PWD="$(dirname "$0")"

echo " #u#traliva_kit_debug## " >> "$1"/"$2"/gameplay.js
"$PWD"/project_final.sh "$1" "$2"

cp "$PWD"/project_local_index.html "$1"/"$2"/index.html

style=$(sed 's/#RES#/res/g' "$1"/"$2"/style.css)
echo "$style" > "$1"/"$2"/style.css
