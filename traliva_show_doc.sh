#!/bin/bash

curDir=$(dirname "$0")
path=$(realpath $curDir)/doc/index.html
firefox --new-window file://$path
