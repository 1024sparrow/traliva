#!/usr/bin/env python3

import sys

ar = sys.argv
#print(ar)

opt = []
js = []
css = []

opt_len = ar[1]
ar = ar[2:]
for i in range(0, int(opt_len)):
    opt.append(ar[0])
    ar = ar[1:]

js_len = ar[0]
ar = ar[1:]
for i in range(0, int(js_len)):
    js.append(ar[0])
    ar = ar[1:]

css_len = ar[0]
ar = ar[1:]
for i in range(0, int(css_len)):
    css.append(ar[0])
    ar = ar[1:]

#print('opt: ', opt)
#print('js: ', js)
#print('css: ', css)
#print('ar: ', ar)
