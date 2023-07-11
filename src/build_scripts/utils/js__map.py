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
	print('get_map()')
	#print('pout_js_css: ', pout_js_css)##

def apply_map(p_js, p_css, p_js_css):
	print('apply_map()')
	for i in p_js_css:
		#print('#%s:' %  i['filepath'])
		if i['filepath'] is None:
			continue
		cand = ''
		for i_text in i['text']:
			cand += i_text['text']
		#print(cand)
		f = open(i['filepath'], 'w')
		f.write(cand)
		f.close()

#def process_code_fragment(p_code):
#	 retval = '>>>>' + p_code + '<<<<'
#	 #retval = 'XXXX'
#	 return retval

# p_text - массив отдельных строк
# Должен вернуть массив фрагментов с указанием их типов (0 - комментарий, 1 - код, 2 - содержимое строки)
# [
#	  {
#		  type: 1,
#		  text: 'do_some();\nconsole.log(\''
#	  },
#	  {
#		  type: 2,
#		  text: 'hello world'
#	  },
#	  {
#		  type: 1,
#		  text: '\');'
#	  },
#	  {
#		  type: 0,
#		  text: '//некий комментарий'
#	  },
# ]
re_one_line_comment = re.compile(r'//.*', re.DOTALL)
def _get_text_as_array(p_text, pp_comment, pp_newlines):
	global __type
	global __buffer

	___type = None
	__buffer = ''
	retval = []
	if not pp_newlines:
		pp_comment = False
	use_strict_used = False
	a = ''
	usestrict_pos = None
	for line in p_text:
		stripline = line.strip()
		if not use_strict_used:
			if stripline.startswith("'use strict'") or stripline.startswith('"use strict"'):
				usestrict_pos = len(a)
				a += '#' # любой символ. В результат он не попадёт.
				use_strict_used = True
				continue
		if pp_comment:
			a += line
		else:
			if not pp_newlines:
				line_cand = line.strip()
			a += re.sub(re_one_line_comment, '', line_cand)
	#b = ''
	in_comment_1 = False # // ...
	in_comment_2 = False # /* ... */
	in_comment = False
	in_string_1 = False # '
	in_string_2 = False # "
	in_string_3 = False # ``
	string_type = 0 # for in_string_3
	#string_content = [] # for in_string_3
	#string_state = 0 # for in_string_3
	#string_indent = 0 # for in_string_3
	"""
	`` - тупое экранирование. Сохраняются переносы строки и все символы между '`'
	`
		asd
	` --> '\n\t\tasd\n\t'
	1`` - как ``, но дополнительно обрезаются первая и последняя строки
	1`
		asd
	` --> '\t\tasd'
	2`` - как 1``, но дополнительно убираются отступы. Вычисляется наибольший общий отступ, и он отрезается. Отступы работают только с пробелами - символ табуляции не считается за отступ.
	var a = 2`
		var a =
			5;
	`; --> var a ='var a =\n\t5;';
	3`` - убираются крайние пробельные символы и все переносы строки. Если последний символ в строке отличен от '>' и первый символ следующей строки отличен от '<', то в результат вставляется пробел. Первая и последняя строки не обрезаются (так, если что..).
	var a = 3`
		<table>
			<tr>
			</tr>
			<tr>
			</tr>
		</table>
	` --> var a = '<table><tr></tr><tr></tr></table>'
	"""
	in_string = False
	prev_char = 's' # nor '\\' or '/' or '*'
	code_cand = ''
	counter = 0
	for i in a:
		if not (counter is None):
			if counter == usestrict_pos:
				t = __buffer + code_cand
				if __buffer:
					retval.append({
						'type': __type,
						'text': __buffer
					})
					__buffer = ''
				if code_cand:
					retval.append({
						'type': 1,
						'text': code_cand
					})
					code_cand = ''
				retval.append({
					'type': 1,
					'text': "\n'use strict';\n"
				})
				__type = 1
				counter += 1
				continue
		counter += 1

		skip_current = False
		if (not in_comment) and (not in_string) and prev_char == '/' and i == '/':
			if len(code_cand) > 0:
				code_cand = code_cand[:-1]
			#b += process_code_fragment(code_cand) + '/'
			_accumulate_array_by_symbols(1, code_cand, retval)
			_accumulate_array_by_symbols(0, '/', retval)
			code_cand = ''
			in_comment_1 = True
			in_comment = True
		elif in_comment_1 and i == '\n':
			if not in_comment_2:
				in_comment_1 = False
				in_comment = False
		elif prev_char == '/' and i == '*':
			if not in_comment_1:
				if len(code_cand) > 0:
					code_cand = code_cand[:-1]
				#b += process_code_fragment(code_cand) + '/'
				_accumulate_array_by_symbols(1, code_cand, retval)
				code_cand = ''
				in_comment_2 = True
				in_comment = True
				if pp_comment:
					_accumulate_array_by_symbols(0, '/', retval)
				#if not pp_comment:
				#	 b = b[:-1] # удаляем предыдущий символ ('/')
		elif prev_char == '*' and i == '/':
			if not in_comment_1:
				in_comment_2 = False
				in_comment = False
				skip_current = True

		elif prev_char == '\\' and i == '\\':
			prev_char = 's'
			#b += i
			_accumulate_array_by_symbols(__type, i, retval)
			continue
		elif prev_char != '\\' and i == '"':
			if not in_comment and not in_string_1 and not in_string_3:
				if in_string:
					if in_string_2:
						in_string_2 = False
					else:
						in_string_1 = False
						in_string_3 = False
					in_string = False
				else:
					#b += process_code_fragment(code_cand + '"')
					skip_current = True
					_accumulate_array_by_symbols(1, code_cand + '"', retval)
					skip_current = True
					code_cand = ''
					in_string_2 = True
					in_string = True
		elif prev_char != '\\' and i == "'":
			if not in_comment and not in_string_2 and not in_string_3:
				if in_string:
					if in_string_1:
						in_string_1 = False
					else:
						in_string_2 = False
						in_string_3 = False
					in_string = False
				else:
					#b += process_code_fragment(code_cand + "'")
					skip_current = True
					_accumulate_array_by_symbols(1, code_cand + "'", retval)
					skip_current = True
					code_cand = ''
					in_string_1 = True
					in_string = True
		elif prev_char != '\\' and i == "`":
			if not in_comment and not in_string_1 and not in_string_2:
				if in_string:
					#skip_current = True
					if in_string_3:
						#in_string_3 = False
						if string_type == 0 or string_type == 3:
							tmp = string_content
						else:
							tmp = string_content[1:-1] # обрезаем первую и последнюю строки
						if string_type == 2:
							indent = 10000
							for ca in tmp:
								cand = 0
								for ca_i in ca:
									if ca_i == ' ':
										cand += 1
									else:
										break
								if cand < indent:
									indent = cand
						if string_type == 3:
							prev = 'q' # any letter symbol
							tmp_between_parath = False
							for ca in [tmp2.strip() for tmp2 in tmp]:
								if len(ca) and len(prev) and prev[-1] != '>' and ca[0] != '<':
									_accumulate_array_by_symbols(2, ' ', retval)
									tmp_between_parath = False
								else:
									tmp_between_parath = True
								cand = ca
								if tmp_between_parath:
									while len(cand) and cand[0] == ' ':
										cand = cand[1:]
								_accumulate_array_by_symbols(2, ca, retval)
								prev = ca
						else:
							for ca in tmp:
								if string_type == 2:
									cand = ca[indent:]
								else:
									cand = ca
								_accumulate_array_by_symbols(2, cand, retval)
					else:
						in_string_1 = False
						in_string_2 = False
					_accumulate_array_by_symbols(1, code_cand + "'", retval)
					in_string = False
				else:
					skip_current = True
					#print('::',prev_char,'::::::::::', code_cand)
					in_string_3 = True
					in_string = True
					string_type = 0
					string_content = ['']
					string_state = 0
					string_indent = 0
					if prev_char == '1':
						string_type = 1
						code_cand = code_cand[:-1]
					elif prev_char == '2':
						string_type = 2
						code_cand = code_cand[:-1]
					elif prev_char == '3':
						string_type = 3
						code_cand = code_cand[:-1]
					_accumulate_array_by_symbols(1, code_cand + "'", retval)
					code_cand = ''
		if (not in_comment) and (not skip_current):
			if in_string:
				if in_string_3:
					if i == '\n':
						string_content.append('')
					else:
						ca = i
						if i == "'":
							ca = '\\\''
						string_content[-1] += ca
				else:
					#b += i
					_accumulate_array_by_symbols(2, i, retval)
			else:
				if in_string_3:
					#_accumulate_array_by_symbols(1, "'", retval)
					#code_cand += "'"
					in_string_3 = False
				else:
					code_cand += i
		else: # комментарии /* ... */
			if not in_string:
				if pp_comment:
					#b += i
					_accumulate_array_by_symbols(0, i, retval)
		prev_char = i
		prev_instring = in_string
	#b += process_code_fragment(code_cand)
	_accumulate_array_by_symbols(1, code_cand, retval)
	_stop_accumulating_array_by_symbols(retval)

	return retval

__buffer = ''
__type = None
def _accumulate_array_by_symbols(pin_type, pin_fragment, pout_target):
	global __buffer
	global __type
	if len(pin_fragment) > 0:
		if pin_type == __type:
			__buffer += pin_fragment
		else:
			if __buffer:
				pout_target.append({
					'type': __type,
					'text': __buffer
				})
			__type = pin_type
			__buffer = pin_fragment

def _stop_accumulating_array_by_symbols(pout_target):
	global __buffer
	global __type
	if __buffer:
		pout_target.append({
			'type': __type,
			'text': __buffer
		})
		__buffer = ''
	__type = None
