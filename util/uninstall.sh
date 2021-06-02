#!/bin/bash

if [ ! $(id -u) -eq 0 ]
then
	echo Run this under ROOT only!
	exit 1
fi

tmp=/usr/local/bin/traliva
if [ -a $tmp ]
then
	rm $tmp
fi

tmp=/usr/share/traliva
if [ -d $tmp ]
then
	rm -rf $tmp
fi

tmp=/usr/share/bash-completion/completions/traliva
if [ -f $tmp ]
then
	rm $tmp
fi
