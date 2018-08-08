#!/usr/bin/env python3

## True, если указанный символ - пробельный символ или спецсимвол(';', '.', ')' и т.д.)
def is_spacespec(p_char):
    if p_char.isspace():
        return True
    if p_char.isalpha():
        return False
    if p_char == '_':
        return False
    if p_char == '$':
        return False
    if p_char.isdigit():
        return False
    return True # спецсимвол

def is_letter(p_char):
    if p_char.isalpha():
        return True
    if p_char == '_':
        return True
    return False

def is_letterdigit(p_char):
    if p_char.isalpha():
        return True
    if p_char.isdigit():
        return True
    if p_char == '_':
        return True
    return False
