#!/bin/bash
# Финальная сборка директории project: склеивание частей воедино.

source $1/$2/config
# COMPRESS_USAGE
# COMPRESS_NAMES
# COMPRESS_LINEBREAKS
# COMPRESS_USAGE
# TARGET_UBUNTU_DESKTOP
# TARGET_WEB
# CO_DEBUG
# CO_RELEASE

UTILS_PATH=$(dirname "$0")/utils
############################

# Здесь мы обходим дерево директорий children и производим изменения в файлах в этом дереве
# Формируем пути к папкам (переменные root, list и all) и к файлам (all_js, all_css и all_js_css).
root=$1/$2
declare -a list # список директорий на обработку. Не включая корень
declare -a all_js
declare -a all_css
stack=($root)
#echo "$(ls $root)"
if [ -f $root/gameplay.js ]
then
    all_js=(${all_js[@]} $root/gameplay.js)
else
    echo "Не найден файл $root/gameplay.js"
    exit 1
fi
if [ -f $root/style.css ]
then
    all_css=(${all_css[@]} $root/style.css)
else
    echo "Не найден файл $root/style.css"
    exit 1
fi
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
                if [ ! -f $element/$i/style.css ]
                then
                    echo "Не найден файл $element/$i/style.css.js - директория $element/$i пропускается"
                    continue 1
                fi
                if [ -f $element/$i/gameplay.js ]
                then
                    all_js=(${all_js[@]} $element/$i/gameplay.js)
                else
                    echo "Не найден файл $element/$i/gameplay.js - директория $element/$i пропускается"
                    continue 1
                    #exit 1
                fi
                all_css=(${all_css[@]} $element/$i/style.css)
                stack=(${stack[@]} $element/$i)
                list=(${list[@]} $element/$i)
            fi
        done
    fi
done
all=($root ${list[@]})
all_js_css=(${all_js[@]} ${all_css[@]})

############################
# Ожидается в директориях traliva и traliva_kit найти файл style.css и директорию res
declare -a usage_addon_keys

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
    #cp $i/gameplay.js $i/gameplay.js_tmp
done

#if [ "$CO_DEBUG" = true ]
#then
#    usage_addon_keys=(${usage_addon_keys[@]} traliva_debug)
#    #usage_addon_keys=(${usage_addon_keys[@]} traliva_aaa)
#fi
#if [ "$COMPRESS_USAGE" = true ]
#then
#    #
#    #$UTILS_PATH/sugar/usage.sh "\"${all_js_css[@]}\"" "\"${usage_addon_keys[@]}\""
#fi
## -- синтаксический сахар: перечисления
## ==
#if [ "$CO_RELEASE" = true ]
#then
#    #if [ "$COMPRESS_NAMES" = true ]
#    #then
#    #fi
#    if [ "$COMPRESS_LINEBREAKS" = true ]
#    then
#        for i in $all
#        do
#            cat $i/style.css_tmp | $UTILS_PATH/css.py > $i/style.css_tmp2 && mv $i/style.css_tmp2 $i/style.css_tmp
#            cat $i/gameplay.js_tmp | $UTILS_PATH/js.py > $i/gameplay.js_tmp2 && mv $i/gameplay.js_tmp2 $i/gameplay.js_tmp
#        done
#    fi
#fi
for i in $all
do
    mv $i/style.css_tmp $i/style.css
    #mv $i/gameplay.js_tmp $i/gameplay.js
done

# ###############
flags=0
if [ "$COMPRESS_NAMES" = true ]; then flags=$(($flags|0x2)); echo "FLAG names: compress_names"; fi
if [ "$COMPRESS_LINEBREAKS" = true ]; then flags=$(($flags|0x4)); echo "FLAG linebreaks: compress_linebreaks"; fi
if [ "$CO_RELEASE" = true ]
then
	flags=$(($flags|0x8))
	echo " #u#release##" >> ${all_js[0]}
	echo "FLAG release: release"
fi
if [ "$CO_DEBUG" = true ]
then
    echo " #u#traliva_kit_debug## #u#debug##" >> ${all_js[0]}
fi
echo "flags: $flags"

$UTILS_PATH/js.py 1 $flags ${#all_js[@]} ${all_js[@]} ${#all_css[@]} ${all_css[@]} "$root"
