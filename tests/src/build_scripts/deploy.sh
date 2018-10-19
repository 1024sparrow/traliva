#!/bin/bash

echo "Первый параметр: $1" # /home/boris/da/pro/traliva/tests
echo "Второй параметр: $2" # compiled

pushd "$1"/compiled/traliva_kit/
mv traliva_kit.js traliva_kit.js.tmp
echo "#u#traliva_kit_debug##"  > traliva_kit.js
cat traliva_kit.js.tmp >> traliva_kit.js
rm traliva_kit.js.tmp
popd
"$1"/../src/build_scripts/utils/js.py 1 0 4 "$1"/compiled/traliva/traliva.js "$1"/compiled/traliva/style.css "$1"/compiled/traliva_kit/traliva_kit.js "$1"/compiled/traliva_kit/style.css 0 "$1"/"$2"
