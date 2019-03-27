#!/usr/bin/env python3

#from . import generate_varname

generate_varname__ar1 = 'qwertyuiopasdfghjklzxcvbnm'
generate_varname__ar2 = 'qwertyuiopasdfghjklzxcvbnm1234567890'
generate_varname__n1 = len(generate_varname__ar1)
generate_varname__n2 = len(generate_varname__ar2)
def generate_varname(p_n):
    retval = ''
    n = p_n
    while n >= generate_varname__n1:
        retval = generate_varname__ar2[n % generate_varname__n2] + retval
        n = n // generate_varname__n2
    retval = generate_varname__ar1[n] + retval
    return retval

for i in range(15000):
    print('%s -- %s' % (i, generate_varname(i)))
