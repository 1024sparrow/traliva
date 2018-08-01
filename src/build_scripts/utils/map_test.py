#!/usr/bin/env python3

def process(p_js, p_css, p_js_css):
    print('map_test: process()')
    print('Перед именением:')
    print('p_js:', p_js)
    print('p_js_css:', p_js_css)
    
    #
    p_js_css[1]['text'] = '/' + p_js[1]['text']
    #

    print('После изменения:')
    print('p_js:', p_js)
    print('p_js_css:', p_js_css)
