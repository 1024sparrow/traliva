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

pp_comment = True # оставляем комментарии. Комментарии должны быть отключены, если мы включаем убирание переносов строк.
pp_newlines = False # оставляем переносы строк

if not pp_newlines:
    pp_comment = False

a = ''
re_one_line_comment = re.compile(r'//.*', re.DOTALL)
use_strict_used = False
for line in sys.stdin.readlines():
    stripline = line.strip()
    if not use_strict_used:
        if stripline.startswith("'use strict'") or stripline.startswith('"use strict"'):
            print("'use strict';")
            use_strict_used = True
            continue
    if pp_comment:
        a += line
    else:
        if not pp_newlines:
            line_cand = line.strip()
            #line_cand = re.sub(re.compile(r'\s*=\s*', re.DOTALL), '=', line_cand)
            #line_cand = re.sub(re.compile(r'\s*,\s*', re.DOTALL), ',', line_cand)
            #line_cand = re.sub(re.compile(r'\s*<\s*', re.DOTALL), '<', line_cand)
            #line_cand = re.sub(re.compile(r'\s*>\s*', re.DOTALL), '>', line_cand)
            #line_cand = re.sub(re.compile(r'\s*;\s*', re.DOTALL), ';', line_cand)
            #line_cand = re.sub(re.compile(r'\s*{\s*', re.DOTALL), '{', line_cand)
            #line_cand = re.sub(re.compile(r'\s*}\s*', re.DOTALL), '}', line_cand)
            #line_cand = re.sub(re.compile(r'\s*\+\s*', re.DOTALL), '+', line_cand)
            #line_cand = re.sub(re.compile(r'\s*-\s*', re.DOTALL), '-', line_cand)
            #line_cand = re.sub(re.compile(r'\s*\+=\s*', re.DOTALL), '+=', line_cand)
            #line_cand = re.sub(re.compile(r'\s*-=\s*', re.DOTALL), '-=', line_cand)
            #line_cand = re.sub(re.compile(r'\s*\*\s*', re.DOTALL), '*', line_cand)
            #line_cand = re.sub(re.compile(r'\s*/\s*', re.DOTALL), '/', line_cand)
            #line_cand = re.sub(re.compile(r'\s*\|\s*', re.DOTALL), '|', line_cand)
            #line_cand = re.sub(re.compile(r'\s*\|\|\s*', re.DOTALL), '||', line_cand)
            #line_cand = re.sub(re.compile(r'\s*&&\s*', re.DOTALL), '&&', line_cand)
            #line_cand = re.sub(re.compile(r'\s*~\s*', re.DOTALL), '~', line_cand)
            #line_cand = re.sub(re.compile(r'\s*!\s*', re.DOTALL), '!', line_cand)
        a += re.sub(re_one_line_comment, '', line_cand)
b = ''
in_comment = False
in_string_1 = False # '
in_string_2 = False # "
in_string = False # boris here
prev_char = 's' # nor '\\' or '/' or '*'
code_cand = ''
for i in a:
    skip_current = False
    if prev_char == '/' and i == '*':
        b += code_cand
        code_cand = ''
        in_comment = True
        if not pp_comment:
            b = b[:-1] # удаляем предыдущий символ ('/')
    elif prev_char == '*' and i == '/':
        in_comment = False
        skip_current = True
    elif prev_char != '\\' and i == '"':
        in_string = not in_string
    if not in_comment and not skip_current:
        if in_string:
            #b += i
            code_cand += i
        else:
            #b += i #
            code_cand += i
    else: # комментарии /* ... */
        if pp_comment:
            b += i
    prev_char = i
#for i in b:
    #if i == '/'
print(b)
