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
in_string_1 = False # '
in_string_2 = False # "
in_string = False # boris here
prev_char = 's' # nor '\\' or '/' or '*'
for i in a:
    skip_current = False
    if prev_char == '/' and i == '*':
        in_comment = True
        b = b[:-1] # удаляем предыдущий символ ('/')
    elif prev_char == '*' and i == '/':
        in_comment = False
        skip_current = True
    elif prev_char != '\\' and i == '"':
        in_string = not in_string
    if not in_comment and not skip_current:
        if in_string:
            b += i
        else:
            b += i #
    #else:
    #    b += '%'
    prev_char = i
print(b)

