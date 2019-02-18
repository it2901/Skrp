#!/usr/bin/env bash
echo "Dropping db if exists (…)"
dropdb --if-exists netjson_dev
echo "Creating database (…)"
createdb netjson_dev 
# $? is a magic bash variable assigned
# to the exit code of the last command
if [ $? -eq 0 ]; then
  echo "Database created."
  echo "Creating database structure (…)"
  psql -d netjson_dev -f database/001_initial_schema.sql
  echo "Database structure created"
else
  echo "Creating database structure failed"
  exit 1
fi
