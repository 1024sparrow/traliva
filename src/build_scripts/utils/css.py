#!/usr/bin/env python3
#-*- coding: utf-8 -*-
######################
# Сжимает (на предмет пробелов и символов перевода строки) CSS-файлы. Также при необходимости может засунуть каждый элемент CSS под какой-то id (применимо при компиляции части какого-то более крупного CSS-файла)
# Необязательный параметр - под какой id всё содержимое CSS надо засунуть. Значение по умолчанию - ни под какой, т.е. оставляем как есть, только сжимаем.
# Входной CSS читает из стандартного ввода
# Выходной CSS выводит в стандартный вывод
######################
######################
import sys, re
if len(sys.argv) == 1:
    p_prefix = ''
else:
    p_prefix = '#' + sys.argv[1] + ' '
a = ''
for line in sys.stdin.readlines():
    a += line.replace('\n', '')
a = re.sub(re.compile("/\*.*?\*/",re.DOTALL ) ,"" ,a)
a = re.sub(re.compile("\s*{\s*",re.DOTALL ) ,"{" ,a)
a = re.sub(re.compile("\s*}\s*",re.DOTALL ) ,"}" ,a)
a = re.sub(re.compile("\s*;\s*",re.DOTALL ) ,";" ,a)
a = re.sub(re.compile("\s*:\s*",re.DOTALL ) ,":" ,a)
a = re.sub(re.compile("\s*,\s*",re.DOTALL ) ,"," ,a)
b = ''
tmp_in = ''
tmp_out = ''
inbrackets = False
for index in range(0, len(a)):
    i = a[index]
    if i == '{':
        inbrackets = True
        b += p_prefix + tmp_out
        tmp_out = ''
    if inbrackets:
        tmp_in += i
    else:
        if i == ',':
            tmp_out += ',' + p_prefix
        else:
            tmp_out += i
    if i == '}':
        inbrackets = False
        b += tmp_in
        tmp_in = ''
print b
