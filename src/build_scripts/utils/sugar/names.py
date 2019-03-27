#!/usr/bin/env python3
#    for fil in p_js_css:
#        #if not '1.js' in fil['filepath']:#
#        #    continue#
#        for fragment in fil['text']:
#            if fragment['type'] == 1:
#                #print('#### INIT:\n', fragment['text'])
#                s = 0
#                a = '' # изменённый текст на замещение старого
#                id_cand = ''
#                t = '' # текущий фрагмент #u#...##
#                detected = False
#                for i in fragment['text']:

# bla bla $hello_1 bla bla  bla4 function(){ <-- function тоже в список "использованных имён переменных"
#123312331bccccccc12331233112333123333333111
#    *   *        *   *   *     *        *
# var blabla = 42;
# 2331233333111001
#    *      *
#b - 11
#c - 12

from . import js_specwords
from .char_check_func import is_spacespec, is_letter, is_letterdigit
import sys, json

# p_justRemoveDollar = True, когда заменять не надо. В таком случае мы убираем символы '$' (заменяем на 'ss__')
def process(p_js, p_css, p_js_css, p_targetProjMap, p_justRemoveDollar):
    print('names: process()')

    vars_as_map = {}
    vars = []
    words = set()
    var_names_map = {} # переменная -> её новое имя

    save_word = None
    save_var = None

    for fil in p_js_css:
        for fragment in fil['text']:
            if fragment['type'] in [1,2]:
                s = 0
                word_cand = ''
                var_cand = ''
                for i in fragment['text']:
                    if s == 0 and i == '$':
                        s = 12
                    elif s == 0 and is_letter(i):
                        word_cand += i
                        s = 2
                    elif s in [2,3] and is_letterdigit(i):
                        word_cand += i
                        s = 3
                    elif s in [12, 13] and is_letterdigit(i):
                        var_cand += i
                        s = 13
                    else:
                        if word_cand:
                            words.add(word_cand)
                            word_cand = ''
                        if var_cand:
                            if var_cand in vars_as_map:
                                vars_as_map[var_cand] += 1
                            else:
                                vars_as_map[var_cand] = 1
                            var_cand = ''
                        s = 0
                if var_cand:
                    if var_cand in vars_as_map:
                        vars_as_map[var_cand] += 1
                    else:
                        vars_as_map[var_cand] = 1
    for i in vars_as_map:
        vars.append((vars_as_map[i], i))
    vars = sorted(vars, key=lambda p: -p[0])
    words |= js_specwords.specwords

    #print('detected vars: ', vars)#
    #print('detected words (+): ', words)#

    if p_justRemoveDollar:
        for i in vars:
            cand = 'ss__' + i[1]
            var_names_map[i[1]] = cand
    else:
        counter = 0
        for i in vars:
            #print('--', i[1])
            cand = generate_varname(counter)
            while cand in words:
                cand = generate_varname(counter)
                counter += 1
            var_names_map[i[1]] = cand
            counter += 1
    #print('var_names_map: ', var_names_map)#

    f = open('%s/namesMap.json' % p_targetProjMap, 'w')
    f.write(json.dumps(var_names_map, indent = 4))
    f.close()

    # Подставляем полученные значения
    for fil in p_js_css:
        for fragment in fil['text']:
            s = 0
            var_cand = ''
            a = ''
            for i in fragment['text']:
                if s == 0 and i == '$':
                    s = 12
                elif s in [12, 13] and is_letterdigit(i):
                    var_cand += i
                    s = 13
                else:
                    if var_cand:
                        if var_cand in var_names_map:
                            a += var_names_map[var_cand]
                        else:
                            a += var_cand
                        var_cand = ''
                    s = 0
                    a += i
            if var_cand:
                if var_cand in var_names_map:
                    a += var_names_map[var_cand]
                else:
                    a += var_cand
            fragment['text'] = a

generate_varname__ar1 = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
generate_varname__ar2 = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890'
generate_varname__n1 = len(generate_varname__ar1)
generate_varname__n2 = len(generate_varname__ar2)
def generate_varname(p_n):
    retval = ''
    n = p_n
    while n >= generate_varname__n1:
        retval = generate_varname__ar2[n % generate_varname__n2] + retval
        n = n // generate_varname__n2
    retval = generate_varname__ar1[n] + retval
    return retval
