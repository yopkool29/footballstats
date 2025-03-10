#!/bin/sh
docker compose build --progress=plain
#docker compose run --rm migration npx prisma db seed
