#!/usr/bin/env python3

def process(p_js, p_css, p_js_css):
    print('min: process()')
    for fil in p_js:
        for fragment in fil['text']:
            if fragment['type'] == 1:
                s = 3
                a = ''
                for i in fragment['text']:
                    if i.isspace():
                        cand = ' '
                    elif i.isalpha() or i in '_$':
                        if not s == 3:
                            a += cand
                        cand = ''
                        a += i
                        s = 1
                    elif i.isdigit():
                        if not s == 3:
                            a += cand
                        cand = ''
                        a += i
                        s = 2
                    else:
                        cand = ''
                        a += i
                        s = 3
                fragment['text'] = a
