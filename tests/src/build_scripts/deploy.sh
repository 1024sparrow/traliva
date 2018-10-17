#!/bin/bash

echo "Первый параметр: $1" # /home/boris/da/pro/traliva/tests
echo "Второй параметр: $2" # compiled

"$1"/../src/build_scripts/utils/js.py 1 0 2 "$1"/compiled/traliva/traliva.js "$1"/compiled/traliva_kit/traliva_kit.js 0 "$1"/"$2"
