#!/usr/bin/env python3

import re

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
                fragment['text'] = a
    print('detected activated: ', activated_ids)

    id_current = None
    activated_ids__0 = ['#USAGE_DEGIN#%s##' % i for i in activated_ids]
    activated_ids__1 = ['#USAGE_END#%s##' % i for i in activated_ids]
    #print(activated_ids__0)
    f_begin = lambda p:{
        #index_fragm:
    }
    for fil in p_js_css:
        m = []
        fragment_counter = 0
        for fragment in fil['text']:
            if fragment['type'] == 1:
                #[m.start() for m in re.finditer('test', 'test test test test')]
                # a = 's f#USAGE_BEGIN#qwed3##ddf 4r'
                # [(i.start(), i.group()) for i in re.finditer('#USAGE_BEGIN#(.*)##', a)]
                for patt in [(0,'#USAGE_BEGIN#(.*)##'), (1,'#USAGE_END#(.*)##')]:
                    for i in re.finditer(patt[1], fragment['text']):
                        m.append({
                            'fragment_index': fragment_counter,
                            'char_index': i.start(),
                            'id': i.groups()[0],
                            'string': i.group(),
                            'type': patt[0]
                        })
            fragment_counter += 1
        #print('m:', m)
        #print('sorted m:', sorted(m, key=lambda p: float('%s.%s' %(p['fragment_index'], p['char_index']))))
        # файл уже отсортирован
        while m:
            # ищем пару откр-закр с одним id, так чтобы они шли один за другим сразу.
            counter = 0
            prev = None
            found = None
            for i in m:
                if counter:
                    if prev['id'] == i['id']:
                        _process(prev, i, fil['text'])
                        found = counter
                        break
                counter += 1
                prev = i
            if counter:
                # должны удалить из m элементы с индексами counter - 1 и counter
                m = m[:counter - 1] + m[counter + 1:]
            else:
                print('Некорректная разметка #USAGE...#..##: у вас либо какой-то блок не закрывается, либо блоки перекрываются (что недопустимо).')
                exit(1)

def _process(p1, p2, p3):
    print('_process', p1, p2, p3)
