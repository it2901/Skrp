#!/bin/sh

docker build -t netjson_postgres .
mkdir -p persistent_db
docker run --rm --name pg-docker -e POSTGRES_DB=netjson_dev -e POSTGRES_PASSWORD=password -d -p 5432:5432 -v ${PWD}/persistent_db:/var/lib/postgresql/data netjson_postgres
