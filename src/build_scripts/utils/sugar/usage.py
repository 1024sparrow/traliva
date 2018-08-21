#!/usr/bin/env python3

import re
from .char_check_func import is_spacespec, is_letter, is_letterdigit

# 1.) Обходим все файлы и сохраняем id всех активированных, убираем сами активации (#u#...##);
# 2.) Обходим все файлы, удаляем разметку #USAGE_BEGIN#...## и #USAGE_END#...##, оставляем или удаляем код, заключённый в разметку.

def process(p_js, p_css, p_js_css):
    print('usage: process()')
    activated_ids = set()
    clusters = {}
    cluster_name_cand = None
    cluster_item_cand = None
    cluster_items = None
    # состояние обозначаем локальной переменной s (от state)
    # обходим каждый блок текста типа 1 (программный код) посимвольно. Для каждого символа определяется значение состояния.
    # ... #u#идентификатор## ...
    # 0   1234            560
    for fil in p_js_css:
        #if not '1.js' in fil['filepath']:#
        #    continue#
        for fragment in fil['text']:
            if fragment['type'] == 1:
                #print('#### INIT:\n', fragment['text'])
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
                    elif s == 3 and is_letterdigit(i):
                        s = 4
                        id_cand = i
                    elif s == 4 and is_letterdigit(i):
                        id_cand += i
                    elif s == 4 and i == '#':
                        s = 5
                    elif s == 5 and i == '#':
                        s = 0
                        activated_ids.add(id_cand)
                        id_cand = ''
                        detected = True
                    elif s == 1 and i == 'U':
                        cluster_name_cand = ''
                        cluster_item_cand = ''
                        cluster_items = []
                        s = 102
                    elif s == 102 and i == 'S':
                        s = 103
                    elif s == 103 and i == 'A':
                        s = 104
                    elif s == 104 and i == 'G':
                        s = 105
                    elif s == 105 and i == 'E':
                        s = 106
                    elif s == 106 and i == '#':
                        s = 107
                    elif s == 107 and is_letter(i):
                        cluster_name_cand += i
                        s = 108
                    elif s == 108 and is_letterdigit(i):
                        cluster_name_cand += i
                        s = 108
                    elif s == 108 and i == ':':
                        s = 109
                    elif s == 109 and is_letter(i):
                        cluster_item_cand += i
                        s = 110
                    elif s == 110 and is_letterdigit(i):
                        cluster_item_cand += i
                        s = 110
                    elif s == 110 and i == ',':
                        cluster_items.append(cluster_item_cand)
                        cluster_item_cand = ''
                        s = 109
                    elif s == 110 and i == '#':
                        cluster_items.append(cluster_item_cand)
                        cluster_item_cand = ''
                        s = 111
                    elif s == 111 and i == '#':
                        detected = True
                        s = 0
                        clusters[cluster_name_cand] = cluster_items
                        cluster_name_cand = ''
                        cluster_items = []
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
                #print('#### RESULT:\n', a)
                fragment['text'] = a
    #print('detected activated: ', activated_ids)
    #print('detected clusters: ', clusters)
    additional_activated_ids = []
    for i in activated_ids:
        if i in clusters:
            for ii in clusters[i]:
                additional_activated_ids.append(ii)
    for i in additional_activated_ids:
        activated_ids.add(i)

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
                            'type': patt[0],
                            #'order': order
                        })
            fragment_counter += 1
        m = sorted(m, key=lambda p: p['fragment_index'] * 0x100000000000000000000000000000 + p['char_index'])

        #mm = []
        #mm_max_0 = 0
        #mm_max_1 = 0
        #for i in m:
        #    print('---', i)
        #    if i['fragment_index'] >= mm_max_0

        #for i in range(0, len(m)):
        i = 0
        prev_paragr = None
        prev_file = None
        while i < len(m)//2:
            i_0 = 2 * i
            i_1 = i_0 + 1
            m_0 = m[i_0]
            m_1 = m[i_1]
            _process(m_0, m_1, fil['text'], activated_ids, m)
            i += 1

        # файл уже отсортирован
        #while m:
        #    print('-#-')
        #    print(m)
        #    # ищем пару откр-закр с одним id, так чтобы они шли один за другим сразу.
        #    counter = 0
        #    prev = None
        #    found = None
        #    for i in m:
        #        if counter:
        #            if prev['id'] == i['id'] and prev['type'] == 0 and i['type'] == 1:
        #                _process(prev, i, fil['text'], activated_ids)
        #                found = counter
        #                #break
        #        counter += 1
        #        prev = i
        #    if counter:
        #        # должны удалить из m элементы с индексами counter - 1 и counter
        #        m = m[:counter - 1] + m[counter + 1:]
        #    else:
        #        print('Некорректная разметка #USAGE...#..##: у вас либо какой-то блок не закрывается, либо блоки перекрываются (что недопустимо).')
        #        exit(1)

# возвращает количество удалённых символов
def _process(p1, p2, p3, p4, p_fullmap):
    retval = 0
    id = p1['id']
    start_char_index = p1['char_index'] 
    start_char_endindex = start_char_index + len(p1['string']) 
    end_char_index = p2['char_index'] 
    end_char_endindex = end_char_index + len(p2['string']) 

    # удаляем из текста начало блока и, если надо, весь текст внутри блока
    if id in p4: # тэг активирован, убираем только разметку
        p3[p1['fragment_index']]['text'] = p3[p1['fragment_index']]['text'][:start_char_index] + p3[p1['fragment_index']]['text'][start_char_endindex:]
        p3[p2['fragment_index']]['text'] = p3[p2['fragment_index']]['text'][:end_char_index] + p3[p2['fragment_index']]['text'][end_char_endindex:]
        if p1['fragment_index'] == p2['fragment_index']:
            retval = start_char_endindex - start_char_index
        retval += end_char_endindex - end_char_index
    else: # тэг не активирован - убираем как саму разметку, так и текст внутри разметки
        if p1['fragment_index'] == p2['fragment_index']:
            p3[p1['fragment_index']]['text'] = p3[p1['fragment_index']]['text'][:start_char_index] + p3[p2['fragment_index']]['text'][end_char_endindex:]
            retval = end_char_endindex - start_char_index
        else:
            p3[p1['fragment_index']]['text'] = p3[p1['fragment_index']]['text'][:start_char_index]
            p3[p2['fragment_index']]['text'] = p3[p2['fragment_index']]['text'][end_char_endindex:]
            retval = end_char_endindex

    # удаляем, если надо, содержимое всех блоков, которые оказались между теми двумя блоками
    if not id in p4:
        for i in range(p1['fragment_index'] + 1, p2['fragment_index']):
            p3[i]['text'] = ''

    # корректируем индексы символов далее в параграфе
    #print('uiytiuytiuytiuytiuyt:',p3)
    if retval > 0:
        for i in p_fullmap:
            if p2['fragment_index'] == i['fragment_index']:
                i['char_index'] = i['char_index'] - retval
            #print('88888:',i)
    return retval
