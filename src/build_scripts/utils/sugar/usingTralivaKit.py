import sys, json
from .char_check_func import is_letterdigitdollar

def process(p_js, p_css, p_js_css):
	print('Проставляю инклюды задествованных компонентов из TralivaKit')

	# Ищем '[ ,\t]$type: $TralivaKit.XXXXXX[\n,\,]'
	# Первым делом находим в мапе имён переименованные 

	usedComponents = set()
	strAddon = ''

	# $type: $TralivaKit.XXXX,
	# $constructor: $TralivaKit.XXXX,
	for fil in p_js_css:
		for fragment in fil['text']:
			lastFragment = fragment
			if fragment['type'] == 1:
				s = 0
				t = '' # текущий кандидат на добавление

				for i in fragment['text']:
					ordinary = False
					if s == 0 and i.isspace():
						s = 1
					elif s == 1 and i == '$':
						s = 2
					elif s == 2 and i == 't':
						s = 3
					elif s == 2 and i == 'c':
						s = 103
					elif s == 3 and i == 'y':
						s = 4
					elif s == 4 and i == 'p':
						s = 5
					elif s == 5 and i == 'e':
						s = 6

					elif s == 103 and i == 'o':
						s = 104
					elif s == 104 and i == 'n':
						s = 105
					elif s == 105 and i == 's':
						s = 106
					elif s == 106 and i == 't':
						s = 107
					elif s == 107 and i == 'r':
						s = 108
					elif s == 108 and i == 'u':
						s = 109
					elif s == 109 and i == 'c':
						s = 110
					elif s == 110 and i == 't':
						s = 111
					elif s == 111 and i == 'o':
						s = 112
					elif s == 112 and i == 'r':
						s = 6


					elif s == 6 and i == ':':
						s = 7
					elif s == 7 and i.isspace():
						s = 7 # do nothing
					elif s == 7 and i == '$':
						s = 8
					elif s == 8 and i == 'T':
						s = 9
					elif s == 9 and i == 'r':
						s = 10
					elif s == 10 and i == 'a':
						s = 11
					elif s == 11 and i == 'l':
						s = 12
					elif s == 12 and i == 'i':
						s = 13
					elif s == 13 and i == 'v':
						s = 14
					elif s == 14 and i == 'a':
						s = 15
					elif s == 15 and i == 'K':
						s = 16
					elif s == 16 and i == 'i':
						s = 17
					elif s == 17 and i == 't':
						s = 18
					elif s == 18 and i == '.':
						s = 19
					elif s == 19 and is_letterdigitdollar(i):
						t = i
						s = 20
					elif s == 20 and is_letterdigitdollar(i):
						t += i
					elif s == 20 and (i.isspace() or i == ','):
						# в копилку кандидата
						usedComponents.add(t)
						#fragment['text'] = fragment['text'] + ' #120713#' + t  + '## '
						s = 0
						t = ''
					else:
						ordinary = True
						s = 0

	for i in usedComponents:
		# boris here: (230713) привести в соответствие id подключаемых фрагментов c теми id, с которыми они реально подключаются
		strAddon += '#u#' + i  + '## '

	finished =  False
	for fil in p_js_css:
		fragments = []
		for fragment in fil['text']:
			fragment['text'] = fragment['text'] + strAddon
			strAddon = ''
			fragments.append(fragment)
		fil['text'] = fragments
