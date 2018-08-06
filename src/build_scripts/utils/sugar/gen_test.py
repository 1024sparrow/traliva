#!/usr/bin/env python3

#from . import generate_varname

ar1 = 'qwertyuiopasdfghjklzxcvbnm'
ar2 = 'qwertyuiopasdfghjklzxcvbnm1234567890'
n1 = len(ar1)
n2 = len(ar2)
def generate_varname(p_n):
    retval = ''
    n = p_n
    while n >= n1:
        retval = ar2[n % n2] + retval
        n = n // n2
    retval = ar1[n] + retval
    return retval

for i in range(15000):
    print('%s -- %s' % (i, generate_varname(i)))
