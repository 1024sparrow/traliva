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
    # применяем активаторы
    for fil in p_js_css:
        cur_blocks = []
        ifEnable = True
        #id_cand = ''
        fragments = []
        for fragment in fil['text']:
            s = 0
            cand = ''
            broken = ''
            for i in fragment['text']:
                if fragment['type'] == 1:
                    if s == 0 and i == '#':
                        s = 1
                    elif s == 1 and i == 'U':
                        s = 2
                    elif s == 2 and i == 'S':
                        s = 3
                    elif s == 3 and i == 'A':
                        s = 4
                    elif s == 4 and i == 'G':
                        s = 5
                    elif s == 5 and i == 'E':
                        s = 6
                    elif s == 6 and i == '_':
                        s = 7
                    elif s == 7 and i == 'B':
                        s = 8
                    elif s == 8 and i == 'E':
                        s = 9
                    elif s == 9 and i == 'G':
                        s = 10
                    elif s == 10 and i == 'I':
                        s = 11
                    elif s == 11 and i == 'N':
                        s = 12
                    elif s == 12 and i == '#':
                        s = 13
                        id_cand = ''
                    elif s == 13 and is_letterdigit(i):
                        #s = 14
                        id_cand += i
                    elif s == 13 and i == '#':
                        s = 15
                        cur_blocks.append(id_cand)
                        ifEnable = _updateEnableState(cur_blocks, activated_ids)
                    elif s == 15 and i == '#':
                        s = 16
                    elif s == 16:
                        s = 0
                        # ...
                    elif s == 7 and i == 'E':
                        s = 108
                    elif s == 108 and i == 'N':
                        s = 109
                    elif s == 109 and i == 'D':
                        s = 110
                    elif s == 110 and i == '#':
                        s = 113
                        id_cand = ''
                    elif s == 113 and is_letterdigit(i):
                        #s = 114
                        id_cand += i
                    elif s == 113 and i == '#':
                        s = 115
                        if len(cur_blocks) < 1 or id_cand != cur_blocks[-1]:
                            print('SYNTAX ERROR in file "%s". Fragment text:\n %s' % (fil['filepath'], fragment['text']))
                        cur_blocks = cur_blocks[:-1]
                        ifEnable = _updateEnableState(cur_blocks, activated_ids)
                    elif s == 115 and i == '#':
                        s = 116
                    elif s == 116:
                        s = 0
                        # ...
                    else:
                        if s == 15:
                            print('ERROR')
                        elif s == 115:
                            print('ERROR')
                        elif s != 0:
                            cand += broken
                            s = 0
                    #if s == 0:
                    #    cand += broken
                    #    broken = ''
                    if s == 1:
                        broken = i
                    elif s == 0 or s == 16 or s == 116:
                        broken = ''
                    else:
                        broken += i
                if s == 0 and ifEnable:
                    cand += i
            cand += broken
            if len(cand):
                fragment['text'] = cand
                fragments.append(fragment)
        fil['text'] = fragments # во fragments нет фрагментов с пустым текстом

def _updateEnableState(p_curBlocks, p_activatedSet):
    for i in p_curBlocks:
        if not i in p_activatedSet:
            return False
    return True
