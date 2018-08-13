#!/usr/bin/env python3
import sys
import js__map
from sugar import usage, names, enums, min
#import map_test

ar = sys.argv
#print(ar)

opt = []
js_paths = []
css_paths = []

opt_len = ar[1]
ar = ar[2:]
for i in range(0, int(opt_len)):
    opt.append(ar[0])
    ar = ar[1:]

js_len = ar[0]
ar = ar[1:]
for i in range(0, int(js_len)):
    js_paths.append(ar[0])
    ar = ar[1:]

css_len = ar[0]
ar = ar[1:]
for i in range(0, int(css_len)):
    css_paths.append(ar[0])
    ar = ar[1:]

#print('opt: ', opt)
#print('js_paths: ', js_paths)
#print('css_paths: ', css_paths)
#print('ar: ', ar)

js = []
css = []
js_css = []

flags = int(opt[0])
js__map.get_map(js_paths, css_paths, js, css, js_css)
if flags & 0x101:
    usage.process(js, css, js_css)
if not flags & 0x102:
    if flags & 0x201:
        names.process(js, css, js_css)
enums.process(js, css, js_css)
if flags & 0x202:
    if flags & 0x401:
        min.process(js, css, js_css)

##map_test.process(js, css, js_css)
js__map.apply_map(js, css, js_css)
