#!/bin/bash

trap "deactivate && echo virtual environment deactivated" SIGINT SIGTERM
source venv/bin/activate && echo virtual environment activated
./manage.py runserver 0.0.0.0:8080
#PLATFORM_BUILD_PATH=static_build && ./manage.py runserver 0.0.0.0:8080
