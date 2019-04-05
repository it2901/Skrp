#!/bin/sh

docker build -t netjson_postgres .
docker run --rm --name pg-docker -e POSTGRES_DB=netjson_dev -e POSTGRES_PASSWORD=password -d -p 5432:5432 netjson_postgres
