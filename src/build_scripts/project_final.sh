#!/bin/bash
# Финальная сборка директории project: склеивание частей воедино.

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
    echo -n > $1.tmp
    echo "#-*- coding: utf-8 -*-" >> $1.tmp
    echo "import sys, re" >> $1.tmp
    echo "if len(sys.argv) == 1:" >> $1.tmp
    echo "    p_prefix = ''" >> $1.tmp
    echo "else:" >> $1.tmp
    echo "    p_prefix = '#' + sys.argv[1] + ' '" >> $1.tmp
    echo "a = ''" >> $1.tmp
    echo "for line in sys.stdin.readlines():" >> $1.tmp
    echo "    a += line.replace('\n', '')" >> $1.tmp
    echo "a = re.sub(re.compile(\"/\*.*?\*/\",re.DOTALL ) ,\"\" ,a)" >> $1.tmp
    echo "a = re.sub(re.compile(\"\s*{\s*\",re.DOTALL ) ,\"{\" ,a)" >> $1.tmp
    echo "a = re.sub(re.compile(\"\s*}\s*\",re.DOTALL ) ,\"}\" ,a)" >> $1.tmp
    echo "a = re.sub(re.compile(\"\s*;\s*\",re.DOTALL ) ,\";\" ,a)" >> $1.tmp
    echo "a = re.sub(re.compile(\"\s*:\s*\",re.DOTALL ) ,\":\" ,a)" >> $1.tmp
    echo "a = re.sub(re.compile(\"\s*,\s*\",re.DOTALL ) ,\",\" ,a)" >> $1.tmp
    echo "b = ''" >> $1.tmp
    echo "tmp_in = ''" >> $1.tmp
    echo "tmp_out = ''" >> $1.tmp
    echo "inbrackets = False" >> $1.tmp
    echo "for index in range(0, len(a)):" >> $1.tmp
    echo "    i = a[index]" >> $1.tmp
    echo "    if i == '{':" >> $1.tmp
    echo "        inbrackets = True" >> $1.tmp
    echo "        b += p_prefix + tmp_out" >> $1.tmp
    echo "        tmp_out = ''" >> $1.tmp
    echo "    if inbrackets:" >> $1.tmp
    echo "        tmp_in += i" >> $1.tmp
    echo "    else:" >> $1.tmp
    echo "        if i == ',':" >> $1.tmp
    echo "            tmp_out += ',' + p_prefix" >> $1.tmp
    echo "        else:" >> $1.tmp
    echo "            tmp_out += i" >> $1.tmp
    echo "    if i == '}':" >> $1.tmp
    echo "        inbrackets = False" >> $1.tmp
    echo "        b += tmp_in" >> $1.tmp
    echo "        tmp_in = ''" >> $1.tmp
    echo "print b" >> $1.tmp
    cat $1 | python $1.tmp $2 > $1.tmp2
    mv $1.tmp2 $1
    rm $1.tmp
    cd $init_path
}

sed -e "s/#RES#/#RES#\/_traliva/g" $1/$2/traliva/style.css > style.css_tmp
sed -e "s/#RES#/#RES#\/_traliva_kit/g" $1/$2/traliva_kit/style.css >> style.css_tmp
#sed -e "s/#RES#/#RES#/g" $1/$2/style.css >> style.css_tmp
