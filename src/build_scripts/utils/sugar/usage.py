#!/usr/bin/env python3

# 1.) Обходим все файлы и сохраняем id всех активированных, убираем сами активации (#u#...##);
# 2.) Обходим все файлы, удаляем разметку #USAGE_BEGIN#...## и #USAGE_END#...##, оставляем или удаляем код, заключённый в разметку.

def char_valid_for_id(p):
    return p.isalpha() or p.isdigit() or p == '_'

def process(p_js, p_css, p_js_css):
    print('usage: process()')
    activated_ids = set()
    # состояние обозначаем локальной переменной s (от state)
    # обходим каждый блок текста типа 1 (программный код) посимвольно. Для каждого символа определяется значение состояния.
    # ... #u#идентификатор## ...
    # 0   1234            560
    for fil in p_js_css:
        #if not '1.js' in fil['filepath']:#
        #    continue#
        for fragment in fil['text']:
            if fragment['type'] == 1:
                print('#### INIT:\n', fragment['text'])
                s = 0
                a = '' # изменённый текст на замещение старого
                id_cand = ''
                t = '' # текущий фрагмент #u#...##
                detected = False
                for i in fragment['text']:
                    ordinary = False
                    if s == 0 and i == '#':
                        s = 1
                    elif s == 1 and i == 'u':
                        s = 2
                    elif s == 2 and i == '#':
                        s = 3
                    elif s == 3 and char_valid_for_id(i):
                        s = 4
                        id_cand = i
                    elif s == 4 and char_valid_for_id(i):
                        id_cand += i
                    elif s == 4 and i == '#':
                        s = 5
                    elif s == 5 and i == '#':
                        s = 0
                        activated_ids.add(id_cand)
                        id_cand = ''
                        detected = True
                    else:
                        ordinary = True
                        s = 0
                    if ordinary:
                        a += t + i
                        t = ''
                    else:
                        if s:
                            t += i
                        else:
                            if detected:
                                detected = False
                                id_cand = ''
                                t = ''
                            else:
                                a += t
                            t = ''
                    #print('%s - %s' % (s, i))
                print('#### RESULT:\n', a)
    print('detected activated: ', activated_ids)
