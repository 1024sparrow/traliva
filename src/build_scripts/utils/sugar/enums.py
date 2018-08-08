#!/usr/bin/env python3

from .char_check_func import is_spacespec, is_letter, is_letterdigit

# #ENUM#перем#поле1,поле2##

def process(p_js, p_css, p_js_css):
    print('enums: process()')
    for fil in p_js:
        for fragment in fil['text']:
            if fragment['type'] == 1:
                s = 0
                for i in fragment['text']:
                    ordinary = False
                    if s == 0 and i == '#':
                        s = 1
                    elif s == 1 and i == 'E':
                        s = 2
                    elif s == 1 and i == 'M':
                        s = 102
                    elif s == 1 and i == 'a':
                        s = 202
                    elif s == 1 and i == 'e':
                        s = 302
                    elif s == 1 and i == 'm':
                        s = 402
                    ##
                    elif s == 2 and i == 'N':
                        s = 3
                    elif s == 3 and i == 'U':
                        s = 4
                    elif s == 4 and i == 'M':
                        s = 5
                    elif s == 102 and i == 'A':
                        s = 103
                    elif s == 103 and i == 'S':
                        s = 104
                    elif s == 104 and i == 'K':
                        s = 105
                    ##
                    elif s == 5 and i == '#':
                        s = 6
                    elif s == 105 and i == '#':
                        s = 106
                    elif s == 202 and i == '#':
                        s = 203
                    elif s == 302 and i == '#':
                        s = 303
                    elif s == 402 and i == '#':
                        s = 403
                    ##
                    elif s == 6 and is_letter(i):
                        s = 7
                    elif s == 106 and is_letter(i):
                        s = 107
                    elif s == 203 and is_letter(i):
                        s = 204
                    elif s == 303 and is_letter(i):
                        s = 304
                    elif s == 403 and is_letter(i):
                        s = 404
                    ##
                    elif s == 7 and is_letterdigit(i):
                        s = 7
                    elif s == 107 and is_letterdigit(i):
                        s = 107
                    elif s == 204 and is_letterdigit(i):
                        s = 204
                    elif s == 304 and is_letterdigit(i):
                        s = 304
                    elif s == 404 and is_letterdigit(i):
                        s = 404
                    ##
                    elif s == 7 and i == ':':
                        # имеем имя определённой переменной перечисления
                        s = 8
                    elif s == 107 and i == ':':
                        # имеем имя определённой переменной маски
                        s = 108
                    elif s == 304 and i == ':':
                        # имеем имя использумого перечисления
                        s = 307
                    elif s == 404 and i == ':':
                        # имеем имя используемой маски
                        s = 407
                    ##
                    elif s == 8 and is_letter(i):
                        s = 9
                    elif s == 108 and is_letter(i):
                        s = 109
                    elif s == 307 and is_letter(i):
                        s = 308
                    elif s == 407 and is_letter(i):
                        s = 408
                    ##
                    elif s == 9 and is_letterdigit(i):
                        s = 9
                    elif s == 109 and is_letterdigit(i):
                        s = 109
                    elif s == 308 and is_letterdigit(i):
                        s = 308
                    elif s == 408 and is_letterdigit(i):
                        s = 408
                    ##
                    elif s == 9 and i == ',':
                        # имеем имя поля перечисления (определение)
                        s = 10
                    elif s == 109 and i == ',':
                        # имеем имя поля маски (определение)
                        s = 110
                    elif s == 308 and i == ',':
                        # имеем имя поля перечисления (использование)
                        s = 309
                    elif s == 408 and i == ',':
                        # имеем имя поля маски (использование)
                        s = 409
                    ##
                    elif s == 9 and i == '#':
                        s = 11
                    elif s == 109 and i == '#':
                        s = 111
                    elif s == 204 and i == '#':
                        s = 205
                    elif s == 304 and i == '#':
                        s = 305
                    elif s == 404 and i == '#':
                        s = 405
                    elif s == 308 and i == '#':
                        s = 310
                    elif s == 408 and i == '#':
                        s = 410
                    ##
                    elif s == 11 and i == '#':
                        # осуществляем замену объявления перечисления (на пустое место)
                        s = 0
                    elif s == 111 and i == '#':
                        # осуществляем замену объявления маски (на пустое место)
                        s = 0
                    elif s == 205 and i == '#':
                        # осуществляем замену объявления&использования атома
                        s = 0
                    elif s == 305 and i == '#':
                        # осуществляем замену использования типа перечисления
                        s = 0
                    elif s == 405 and i == '#':
                        # осуществляем замену использования типа маски
                        s = 0
                    elif s == 310 and i == '#':
                        # осуществляем замену использования битовой комбинации перечисления (!!!!!!)
                        s = 0
                    elif s == 410 and i == '#':
                        # осуществляем замену использования битовой комбинации маски
                        s = 0


#def dd
