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
print("// js.py: not implemented")

a = ''
re_one_line_comment = re.compile(r'//.*', re.DOTALL)
for line in sys.stdin.readlines():
    #a += line.strip() + '\n'#
    a += re.sub(re_one_line_comment, '', line)
#    a += line.replace('\n', '')
#a = re.sub(re.compile(''))
#a = re.sub(re.compile(r'/\*.*\*/', re.DOTALL), '/**/', a)
"""
a = re.sub(re.compile(r'\s*=\s*', re.DOTALL), '=', a)
a = re.sub(re.compile(r'\s*,\s*', re.DOTALL), ',', a)
a = re.sub(re.compile(r'\s*<\s*', re.DOTALL), '<', a)
a = re.sub(re.compile(r'\s*>\s*', re.DOTALL), '>', a)
a = re.sub(re.compile(r'\s*;\s*', re.DOTALL), ';', a)
a = re.sub(re.compile(r'\s*{\s*', re.DOTALL), '{', a)
a = re.sub(re.compile(r'\s*}\s*', re.DOTALL), '}', a)
"""
#a = re.sub(re.compile(r'//.*\n', re.DOTALL), '', a)
b = ''
in_comment = False
for index in range(0, len(a)):
    b += a[index]
print(b)

