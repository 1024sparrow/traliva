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

def process(p_js, p_css, p_js_css):
    print('names: process()')

    vars_as_map = {}
    vars = []
    words = set()

    save_word = None
    save_var = None

    for fil in p_js_css:
        for fragment in fil['text']:
            if fragment['type'] == 1:
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
    print('detected words: ', words)
    print('detected vars: ', vars_as_map)

## True, если указанный символ - пробельный символ или спецсимвол(';', '.', ')' и т.д.)
def is_spacespec(p_char):
    if p_char.isspace():
        return True
    if p_char.isalpha():
        return False
    if p_char == '_':
        return False
    if p_char == '$':
        return False
    if p_char.isdigit():
        return False
    return True # спецсимвол

def is_letter(p_char):
    if p_char.isalpha():
        return True
    if p_char == '_':
        return True
    return False

def is_letterdigit(p_char):
    if p_char.isalpha():
        return True
    if p_char.isdigit():
        return True
    if p_char == '_':
        return True
    return False
