#!/usr/bin/env python3
import sys
import js__map
from sugar import usage, names, enums, min

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
usage.process(js, css, js_css)
if flags & 0x8:
    if flags & 0x2:
        names.process(js, css, js_css)
    if flags & 0x4:
        min.process(js, css, js_css)
else:
    o = {
        'filepath': None,
        'text':[{
            'type': 1,
            'text': '#u#debug##'
        }]
    }
    for i in [js, css, js_css]:
        i.append(o)

js__map.apply_map(js, css, js_css)
