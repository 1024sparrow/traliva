#!/bin/bash
# Финальная сборка директории project: склеивание частей воедино.

source $1/$2/config
# INCLUDE_DEBUG
# COMPRESS_NAMES
# COMPRESS_LINEBREAKS

UTILS_PATH=$(dirname "$0")/utils
############################

# Здесь мы обходим дерево директорий children и производим изменения в файлах в этом дереве
# Формируем переменные root, list и all.
root=$1/$2
declare -a list # список директорий на обработку. Не включая корень
stack=($root)
while [ ! ${#stack[@]} -eq 0 ]
do
    element=${stack[@]:0:1}/children
    stack=("${stack[@]:1}")
    if [ -d $element ]
    then
        for i in $(ls -1 $element)
        do
            if [ -d $element/$i ]
            then
                stack=(${stack[@]} $element/$i)
                list=(${list[@]} $element/$i)
            fi
        done
    fi
done
all=($root ${list[@]})

############################
# Ожидается в директориях traliva и traliva_kit найти файл style.css и директорию res
sed -e "s/#RES#/#RES#\/_traliva/g" $root/traliva/style.css > $root/style.css_tmp
mv $root/traliva/res $root/res/_traliva
rm -rf $root/traliva
for i in $all
do
    #echo "** $i"
    if [ ! -a $i/style.css_tmp ]; then touch $i/style.css_tmp; fi
    if [ -d $i/traliva_kit ]
    then
        sed -e "s/#RES#/#RES#\/_traliva_kit/g" $i/traliva_kit/style.css >> $i/style.css_tmp
        mv $i/traliva_kit/res $i/res/_traliva_kit
        rm -rf $i/traliva_kit
    fi
    cat $i/style.css >> $i/style.css_tmp
    if [ "$COMPRESS_LINEBREAKS" = true ]
    then
        cat $i/style.css_tmp | $UTILS_PATH/css.py > $i/style.css && rm $i/style.css_tmp
    else
        mv $i/style.css_tmp $i/style.css
    fi
done
