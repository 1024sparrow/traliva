#!/bin/bash

rm -rf test_data
cp -r test_data_init test_data
./js.py 3 11 22 33 3 test_data/1.js test_data/2.js test_data/3.js 2 test_data/1.css test_data/2.css
