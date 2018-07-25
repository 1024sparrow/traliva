#!/usr/bin/env python
#-*- coding: utf-8 -*-
######################
# Сжимает (на предмет пробелов и символов перевода строки) JS-файлы.
# Входной JS читает из стандартного ввода
# Выходной JS выводит в стандартный вывод
######################
######################
# --- NOT IMPLEMENTED ---
import sys, re
"""
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
"""
