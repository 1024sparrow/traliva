#!/bin/bash

test_seq="2 0_0 0_1 3 1_0 1_1 1_2 1 2_0"

echo "test arguments: $test_seq"

./python_script.py $test_seq
