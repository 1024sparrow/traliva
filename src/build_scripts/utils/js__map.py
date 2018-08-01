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
    print('pout_js: ', pout_js)
    print('pout_css: ', pout_css)
    print('pout_js_css: ', pout_js_css)
    print('get_map()')

def apply_map(p_js, p_css, p_js_css):
    print('apply_map()')
    #for i in p_js_css:

def process_code_fragment(p_code):
    retval = '>>>>' + p_code + '<<<<'
    #retval = 'XXXX'
    return retval

# p_text - массив отдельных строк
# Должен вернуть массив фрагментов с указанием их типов (0 - комментарий, 1 - код, 2 - содержимое строки)
re_one_line_comment = re.compile(r'//.*', re.DOTALL)
def _get_text_as_array(p_text, pp_comment, pp_newlines):
    # boris here
    if not pp_newlines:
        pp_comment = False
    use_strict_used = False
    a = ''
    for line in p_text:
        print('#:', line)
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
            a += re.sub(re_one_line_comment, '', line_cand)
    b = ''
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

    return []
