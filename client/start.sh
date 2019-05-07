#!/bin/bash

while ! nc -z db 5432; do sleep 3; done
while ! nc -z backend 8090; do sleep 3; done
python client.py
