#!/usr/bin/env python3

from .char_check_func import is_spacespec, is_letter, is_letterdigit, is_letterdollar, is_letterdigitdollar

# #ENUM#перем#поле1,поле2##

def process(p_js, p_css, p_js_css):
    print('enums: process()')
    registered = {}
    _prohod(p_js, False, registered)
    #print('registered: ', registered)
    _prohod(p_js, True, registered)


def _prohod(p_js, p_is_second, p_registered):
    global_counter = 1 # нулевое значение id зарезервировано для Атомов
    atom_counter = 0
    for fil in p_js:
        for fragment in fil['text']:
            if fragment['type'] == 1:
                s = 0
                a = ''
                cand = '' # #abc#def,rty##
                enum_name = ''
                fields = []
                cand_strict = '' # abc
                fields = []
                field_counter = 1 # 0 - это идентификатор самого типа перечисления
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
                    elif s == 6 and is_letterdollar(i):
                        s = 7
                        enum_name = i
                    elif s == 106 and is_letterdollar(i):
                        s = 107
                        enum_name = i
                    elif s == 203 and is_letterdollar(i):
                        s = 204
                        enum_name = i
                    elif s == 303 and is_letterdollar(i):
                        s = 304
                        if p_is_second:
                            enum_name = i
                    elif s == 403 and is_letterdollar(i):
                        s = 404
                        if p_is_second:
                            enum_name = i
                    ##
                    elif s == 7 and is_letterdigitdollar(i):
                        s = 7
                        enum_name += i
                    elif s == 107 and is_letterdigitdollar(i):
                        s = 107
                        enum_name += i
                    elif s == 204 and is_letterdigitdollar(i):
                        s = 204
                        enum_name += i
                    elif s == 304 and is_letterdigitdollar(i):
                        s = 304
                        if p_is_second:
                            enum_name += i
                    elif s == 404 and is_letterdigitdollar(i):
                        s = 404
                        if p_is_second:
                            enum_name += i
                    ##
                    elif s == 7 and i == ':':
                        # имеем имя определённой переменной перечисления
                        if enum_name in p_registered:
                            print('Перечисление \'%s\' уже используется...' % enum_name)
                        else:
                            p_registered[enum_name] = {
                                'type': 'e',
                                'fields': [],
                                'id': global_counter
                            }
                            if global_counter > 255:
                                print('Превышен лимит количества используемых перечислений')
                                exit(1)
                            global_counter += 1
                        s = 8
                    elif s == 107 and i == ':':
                        # имеем имя определённой переменной маски
                        if enum_name in p_registered:
                            print('Перечисление \'%s\' уже используется...' % enum_name)
                            exit(1)
                        else:
                            p_registered[enum_name] = {
                                'type': 'm',
                                'fields': [],
                                'id': global_counter
                            }
                            if global_counter > 255:
                                print('Превышен лимит количества используемых перечислений')
                                exit(1)
                            global_counter += 1
                        s = 108
                    elif s == 304 and i == ':':
                        # имеем имя использумого перечисления
                        s = 307
                    elif s == 404 and i == ':':
                        # имеем имя используемой маски
                        s = 407
                    ##
                    elif s == 8 and is_letterdollar(i):
                        s = 9
                        cand_strict = i
                    elif s == 108 and is_letterdollar(i):
                        s = 109
                        cand_strict = i
                    elif s == 307 and is_letterdollar(i):
                        cand_strict = i
                        s = 308
                    elif s == 407 and is_letterdollar(i):
                        cand_strict = i
                        s = 408
                    ##
                    elif s == 9 and is_letterdigitdollar(i):
                        s = 9
                        cand_strict += i
                    elif s == 109 and is_letterdigitdollar(i):
                        s = 109
                        cand_strict += i
                    elif s == 308 and is_letterdigitdollar(i):
                        s = 308
                        cand_strict += i
                    elif s == 408 and is_letterdigitdollar(i):
                        s = 408
                        cand_strict += i
                    ##
                    elif s == 9 and i == ',':
                        # имеем имя поля перечисления (определение)
                        s = 10
                        fields.append(cand_strict)
                        #if cand_strict in p_registered[enum_name]['fields']:
                        #    print('поле \'%s\' в перечислении \'%s\' используется дважды' % (cand_strict, enum_name))
                        #    exit(1)
                        #else:
                        #    p_registered[enum_name]['fields'].append(cand_strict)
                    elif s == 109 and i == ',':
                        # имеем имя поля маски (определение)
                        s = 110
                        fields.append(cand_strict)
                        #if cand_strict in p_registered[enum_name]['fields']:
                        #    print('поле \'%s\' в перечислении \'%s\' используется дважды' % (cand_strict, enum_name))
                        #    exit(1)
                        #else:
                        #    p_registered[enum_name]['fields'].append(cand_strict)
                    elif s == 308 and i == ',':
                        # имеем имя поля перечисления (использование)
                        s = 309
                        fields.append(cand_strict)
                    elif s == 408 and i == ',':
                        # имеем имя поля маски (использование)
                        s = 409
                        fields.append(cand_strict)
                    ##
                    elif s == 309 and is_letterdollar(i):
                        cand_strict = i
                        s = 308
                    elif s == 409 and is_letterdollar(i):
                        cand_strict = i
                        s = 408
                    ##
                    elif s == 10 and is_letterdollar(i):
                        s = 9
                        cand_strict = i
                    elif s == 110 and is_letterdollar(i):
                        s = 109
                        cand_strict = i
                    ##
                    elif s == 9 and i == '#':
                        s = 11
                        #print('ENUM FINISHED')
                        fields.append(cand_strict)
                        for ii in fields: 
                            #print('-- %s', ii)
                            if ii in p_registered[enum_name]['fields']:
                                print('поле \'%s\' в перечислении \'%s\' используется дважды' % (cand_strict, enum_name))
                                exit(1)
                            else:
                                p_registered[enum_name]['fields'].append(ii)
                    elif s == 109 and i == '#':
                        s = 111
                        #print('MASK FINISHED')
                        fields.append(cand_strict)
                        for ii in fields: 
                            if ii in p_registered[enum_name]['fields']:
                                print('поле \'%s\' в перечислении \'%s\' используется дважды' % (cand_strict, enum_name))
                                exit(1)
                            else:
                                p_registered[enum_name]['fields'].append(ii)
                    elif s == 204 and i == '#':
                        s = 205
                    elif s == 304 and i == '#':
                        s = 305
                    elif s == 404 and i == '#':
                        s = 405
                    elif s == 308 and i == '#':
                        fields.append(cand_strict)
                        s = 310
                    elif s == 408 and i == '#':
                        fields.append(cand_strict)
                        s = 410
                    ##
                    elif s == 11 and i == '#':
                        # осуществляем замену объявления перечисления (на пустое место)
                        s = 0
                        cand = ''
                    elif s == 111 and i == '#':
                        # осуществляем замену объявления маски (на пустое место)
                        s = 0
                        cand = ''
                    elif s == 205 and i == '#':
                        # осуществляем замену объявления&использования атома
                        s = 0
                        prefix = '__ATOM_'
                        if not (prefix + enum_name) in p_registered:
                            p_registered[prefix + enum_name] = {
                                'type': 'a',
                                'id': atom_counter
                            }
                            atom_counter += 1
                        cand += '#'
                        a += str(p_registered[prefix + enum_name]['id']*256)
                        #a += str(atom_counter*256)
                    elif s == 305 and i == '#':
                        #print('#########('+enum_name+')#')
                        if p_is_second:
                            #print('@@@@@@@:',enum_name)
                            #print(p_registered[enum_name])
                            if enum_name in p_registered:
                                t = p_registered[enum_name]
                                a += hex(t['id'])
                            else:
                                print('перечисление с именем "%s" не зарегистрировано' % enum_name)
                                a += 'перечисление с именем "%s" не зарегистрировано' % enum_name
                                #exit(1)
                        else:
                            a += cand + i
                        cand = ''
                        # осуществляем замену использования типа перечисления
                        s = 0
                    elif s == 405 and i == '#':
                        # осуществляем замену использования типа маски
                        s = 0
                        if p_is_second:
                            if enum_name in p_registered:
                                t = p_registered[enum_name]
                                a += hex(t['id'])
                            else:
                                print('перечисление с именем "%s" не зарегистрировано' % enum_name)
                                a += 'перечисление с именем "%s" не зарегистрировано' % enum_name
                                #exit(1)
                        else:
                            a += cand + i
                        cand = ''
                    elif s == 310 and i == '#':
                        # осуществляем замену использования битовой комбинации перечисления (!!!!!!)
                        s = 0
                        if p_is_second:
                            #print('@@@@@@@:',enum_name)
                            #print('fields for enum: ', fields)
                            if enum_name in p_registered:
                                t = p_registered[enum_name]
                                t_n = 0
                                if len(fields) > 1:
                                    print('Невозможно выбрать несколько полей одновременно из одного перечисления(%s)' % enum_name)
                                    exit(1)
                                for ii in fields:
                                    if ii in t['fields']:
                                        t_i = t['fields'].index(ii)
                                        t_n |= t_i
                                    else:
                                        print('Перечисление %s не имеет поле %s' % (enum_name, ii))
                                        #a += 'Перечисление %s не имеет поле %s' % (enum_name, ii)
                                        exit(1)
                                t_n = t_n * 256 + t['id']
                                a += hex(t_n)
                            else:
                            
                                print('перечисление с именем "%s" не зарегистрировано' % enum_name)
                                a += 'перечисление с именем "%s" не зарегистрировано' % enum_name
                                #exit(1)
                        else:
                            a += cand + i
                        cand = ''
                    elif s == 410 and i == '#':
                        # осуществляем замену использования битовой комбинации маски
                        s = 0
                        if p_is_second:
                            #print('fields for mask: ', fields)
                            if enum_name in p_registered:
                                t = p_registered[enum_name]
                                t_n = 0
                                for ii in fields:
                                    if ii in t['fields']:
                                        t_i = t['fields'].index(ii)
                                        t_i = 2 ** t_i
                                        t_n |= t_i
                                    else:
                                        print('Перечисление %s не имеет поле %s' % (enum_name, ii))
                                        #a += 'Перечисление %s не имеет поле %s' % (enum_name, ii)
                                        exit(1)
                                t_n = t_n * 256 + t['id']
                                a += hex(t_n)
                            else:
                                print('перечисление с именем "%s" не зарегистрировано' % enum_name)
                                a += 'перечисление с именем "%s" не зарегистрировано' % enum_name
                                #exit(1)
                        else:
                            a += cand + i
                        cand = ''
                    else:
                        #print('    ELSE state=%s i=%s' % (s,i))
                        s = 0
                        if cand:
                            a += cand
                            cand = ''
                        cand_strict = ''
                        enum_name = ''
                        fields = []
                        a += i
                    if s:
                        cand += i
                    else:
                        cand = ''
                    #print(i, ' STATE: ', s)
                #print('RESULT: ', a)
                fragment['text'] = a


