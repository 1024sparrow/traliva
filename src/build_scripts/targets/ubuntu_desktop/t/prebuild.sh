#!/bin/bash

echo 123
pushd binutils
tar -zcf ../binutils.tar.gz *
popd
