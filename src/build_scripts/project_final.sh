#!/bin/bash
# Финальная сборка директории project: склеивание частей воедино.
source $1/$2/config
# INCLUDE_DEBUG
# COMPRESS_NAMES
# COMPRESS_LINEBREAKS

#rm -rf $1/$2/traliva $1/$2/traliva_kit

# Ожидается в директориях traliva и traliva_kit найти файл style.css и директорию res

function act__css_compile {
    # Первый параметр: целевой файл
    # Второй параметр: необязательный, id блока, под который нужно это всё засунуть. Оно же относительный путь до директории, где лежит обрабатываемый файл
    #echo "компилим файл \"$1\". Вставляем его в блок с id=\"$2\""

    local init_path=$(pwd)
    if test $# -gt 1;
    then cd $2
    fi
    cat $1 | python utils/css.py $2 > $1.tmp2
    mv $1.tmp2 $1
    cd $init_path
}

#echo "$1/$2/traliva_kit:"
#ls $1/$2/traliva_kit
sed -e "s/#RES#/#RES#\/_traliva/g" $1/$2/traliva/style.css > $1/$2/style.css_tmp
sed -e "s/#RES#/#RES#\/_traliva_kit/g" $1/$2/traliva_kit/style.css >> $1/$2/style.css_tmp
##sed -e "s/#RES#/#RES#/g" $1/$2/style.css >> $1/$2/style.css_tmp
cat $1/$2/style.css >> $1/$2/style.css_tmp
mv $1/$2/style.css_tmp $1/$2/style.css

mv $1/$2/traliva/res $1/$2/res/_traliva
mv $1/$2/traliva_kit/res $1/$2/res/_traliva_kit

mv $1/$2/traliva/traliva.js $1/$2/ && rm -rf $1/$2/traliva
mv $1/$2/traliva_kit/traliva_kit.js $1/$2/ && rm -rf $1/$2/traliva_kit
