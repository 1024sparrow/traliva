#!/usr/bin/env python3
import sys
import js__map
from sugar import usage, names, enums, min

ar = sys.argv
#print(ar)

opt = []
js_paths = []
css_paths = []
target_dir_path = '' # для сохранения такой информации как namesMap 

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

target_dir_path = ar[0]

#print('---- js.py ----')
#print('opt: ', opt)
#print('js_paths: ', js_paths)
#print('css_paths: ', css_paths)
#print('ar: ', target_dir_path)
#print('==== js.py ====')

js = []
css = []
js_css = []

flags = int(opt[0])
js__map.get_map(js_paths, css_paths, js, css, js_css)
usage.process(js, css, js_css)
enums.process(js, css, js_css)
#if not flags & 
if flags & 0x8:
    if flags & 0x2:
        names.process(js, css, js_css, target_dir_path, False)
    else:
        names.process(js, css, js_css, target_dir_path, True)
    if flags & 0x4:
        min.process(js, css, js_css)
else:
    names.process(js, css, js_css, target_dir_path, True)
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
