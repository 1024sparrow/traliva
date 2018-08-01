#!/usr/bin/env python3

import sys, re

def get_map(pin_js_paths, pin_css_paths, pout_js, pout_css, pout_js_css):
    for i_src in [(pin_js_paths, pout_js), (pin_css_paths, pout_css)]:
        for i in i_src[0]:
            with open(i) as f:
                cand = {
                    'filepath': i,
                    'text': f.read()
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

def _get_test_as_array(p_text, pp_comment, pp_newlines):
    # boris here
    if not pp_newlines:
        pp_comment = False
