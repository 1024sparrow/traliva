#!/usr/bin/env python3

def process(p_js, p_css, p_js_css):
    print('min: process()')
    for fil in p_js:
        for fragment in fil['text']:
            if fragment['type'] == 0:
                fragment['text'] = ''
            elif fragment['type'] == 1:
                if fragment['text'] == "\n'use strict';\n":
                    continue
                s = 3
                a = ''
                prev = None
                for i in fragment['text']:
                    if prev == '\\' and i == '\n':
                        a = a[:-1]
                        prev = a[len(a) - 1]
                    else:
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
                        prev = i
                fragment['text'] = a
            elif fragment['type'] == 2:
                fragment['text'] = fragment['text'].replace('\\\n', '')
