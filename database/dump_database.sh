#!/bin/sh

echo "Password is: password"
pg_dump -a -h localhost -U postgres netjson_dev > datadump.sql
