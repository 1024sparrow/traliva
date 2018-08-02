#!/usr/bin/env python3

import sys, re

def get_map(pin_js_paths, pin_css_paths, pout_js, pout_css, pout_js_css):
    for i_src in [(pin_js_paths, pout_js), (pin_css_paths, pout_css)]:
        for i in i_src[0]:
            with open(i) as f:
                cand = {
                    'filepath': i,
                    'text': _get_text_as_array(f.readlines(), True, True)
                }
                i_src[1].append(cand)
                pout_js_css.append(cand)
    print('get_map()')
    print('pout_js_css: ', pout_js_css)

def apply_map(p_js, p_css, p_js_css):
    print('apply_map()')
    for i in p_js_css:
        #print('#%s:' %  i['filepath'])
        cand = ''
        for i_text in i['text']:
            cand += i_text['text']
        #print(cand)
        f = open(i['filepath'], 'w')
        f.write(cand)
        f.close()

#def process_code_fragment(p_code):
#    retval = '>>>>' + p_code + '<<<<'
#    #retval = 'XXXX'
#    return retval

# p_text - массив отдельных строк
# Должен вернуть массив фрагментов с указанием их типов (0 - комментарий, 1 - код, 2 - содержимое строки)
# [
#     {
#         type: 1,
#         text: 'do_some();\nconsole.log(\''
#     },
#     {
#         type: 2,
#         text: 'hello world'
#     },
#     {
#         type: 1,
#         text: '\');'
#     },
#     {
#         type: 0,
#         text: '//некий комментарий'
#     },
# ]
re_one_line_comment = re.compile(r'//.*', re.DOTALL)
def _get_text_as_array(p_text, pp_comment, pp_newlines):
    global __type
    retval = []
    if not pp_newlines:
        pp_comment = False
    use_strict_used = False
    a = ''
    for line in p_text:
        stripline = line.strip()
        if not use_strict_used:
            if stripline.startswith("'use strict'") or stripline.startswith('"use strict"'):
                #print("'use strict';")
                _accumulate_array_by_symbols(1, "'use strict';\n", retval)
                use_strict_used = True
                continue
        if pp_comment:
            a += line
        else:
            if not pp_newlines:
                line_cand = line.strip()
            a += re.sub(re_one_line_comment, '', line_cand)
    #b = ''
    in_comment_1 = False # // ...
    in_comment_2 = False # /* ... */
    in_comment = False
    in_string_1 = False # '
    in_string_2 = False # "
    in_string = False
    prev_char = 's' # nor '\\' or '/' or '*'
    code_cand = ''
    for i in a:
        skip_current = False
        if (not in_comment) and (not in_string) and prev_char == '/' and i == '/':
            if len(code_cand) > 0:
                code_cand = code_cand[:-1]
            #b += process_code_fragment(code_cand) + '/'
            _accumulate_array_by_symbols(1, code_cand, retval)
            _accumulate_array_by_symbols(0, '/', retval)
            code_cand = ''
            in_comment_1 = True
            in_comment = True
        elif in_comment_1 and i == '\n':
            if not in_comment_2:
                in_comment_1 = False
                in_comment = False
        elif prev_char == '/' and i == '*':
            if not in_comment_1:
                if len(code_cand) > 0:
                    code_cand = code_cand[:-1]
                #b += process_code_fragment(code_cand) + '/'
                _accumulate_array_by_symbols(1, code_cand, retval)
                code_cand = ''
                in_comment_2 = True
                in_comment = True
                if pp_comment:
                    _accumulate_array_by_symbols(0, '/', retval)
                #if not pp_comment:
                #    b = b[:-1] # удаляем предыдущий символ ('/')
        elif prev_char == '*' and i == '/':
            if not in_comment_1:
                in_comment_2 = False
                in_comment = False
                skip_current = True

        elif prev_char == '\\' and i == '\\':
            prev_char = 's'
            #b += i
            _accumulate_array_by_symbols(__type, i, retval)
            continue
        elif prev_char != '\\' and i == '"':
            if not in_comment and not in_string_1:
                if in_string:
                    if in_string_2:
                        in_string_2 = False
                    else:
                        in_string_1 = False
                    in_string = False
                else:
                    #b += process_code_fragment(code_cand + '"')
                    _accumulate_array_by_symbols(1, code_cand, retval)
                    _accumulate_array_by_symbols(2, '"', retval)
                    skip_current = True
                    code_cand = ''
                    in_string_2 = True
                    in_string = True
        elif prev_char != '\\' and i == "'":
            if not in_comment and not in_string_2:
                if in_string:
                    if in_string_1:
                        in_string_1 = False
                    else:
                        in_string_2 = False
                    in_string = False
                else:
                    #b += process_code_fragment(code_cand + "'")
                    _accumulate_array_by_symbols(1, code_cand, retval)
                    _accumulate_array_by_symbols(2, "'", retval)
                    skip_current = True
                    code_cand = ''
                    in_string_1 = True
                    in_string = True
        if (not in_comment) and (not skip_current):
            if in_string:
                #b += i
                _accumulate_array_by_symbols(2, i, retval)
            else:
                code_cand += i
        else: # комментарии /* ... */
            if not in_string:
                if pp_comment:
                    #b += i
                    _accumulate_array_by_symbols(0, i, retval)
        prev_char = i
    #b += process_code_fragment(code_cand)
    _accumulate_array_by_symbols(1, code_cand, retval)
    _stop_accumulating_array_by_symbols(retval)

    return retval

__buffer = ''
__type = None
def _accumulate_array_by_symbols(pin_type, pin_fragment, pout_target):
    global __buffer
    global __type
    if pin_fragment:
        if pin_type == __type:
            __buffer += pin_fragment
        else:
            if __buffer:
                pout_target.append({
                    'type': __type,
                    'text': __buffer
                })
            __type = pin_type
            __buffer = pin_fragment

def _stop_accumulating_array_by_symbols(pout_target):
    global __buffer
    global __type
    if __buffer:
        pout_target.append({
            'type': __type,
            'text': __buffer
        })
        __buffer = ''
    __type = None
