#!/bin/bash
# Финальная сборка директории project: склеивание частей воедино.

source $1/$2/config
# INCLUDE_DEBUG
# COMPRESS_NAMES
# COMPRESS_LINEBREAKS

UTILS_PATH=$(dirname "$0")/utils
############################

#rm -rf $1/$2/traliva $1/$2/traliva_kit

# Ожидается в директориях traliva и traliva_kit найти файл style.css и директорию res

#echo "$1/$2/traliva_kit:"
#ls $1/$2/traliva_kit
sed -e "s/#RES#/#RES#\/_traliva/g" $1/$2/traliva/style.css > $1/$2/style.css_tmp
sed -e "s/#RES#/#RES#\/_traliva_kit/g" $1/$2/traliva_kit/style.css >> $1/$2/style.css_tmp
##sed -e "s/#RES#/#RES#/g" $1/$2/style.css >> $1/$2/style.css_tmp
cat $1/$2/style.css >> $1/$2/style.css_tmp
if [ "$COMPRESS_LINEBREAKS" = true ]
then
    cat $1/$2/style.css_tmp | $UTILS_PATH/css.py > $1/$2/style.css && rm $1/$2/style.css_tmp
else
    mv $1/$2/style.css_tmp $1/$2/style.css
fi

mv $1/$2/traliva/res $1/$2/res/_traliva
mv $1/$2/traliva_kit/res $1/$2/res/_traliva_kit

#mv $1/$2/traliva/traliva.js $1/$2/ && rm -rf $1/$2/traliva
#mv $1/$2/traliva_kit/traliva_kit.js $1/$2/ && rm -rf $1/$2/traliva_kit
rm -rf $1/$2/traliva
rm -rf $1/$2/traliva_kit
