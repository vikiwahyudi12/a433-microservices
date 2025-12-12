#!/bin/bash

docker build -t item-app:v1 .

docker images

docker tag item-app:v1 ghcr.io/vikiwahyudi12/item-app:latest

echo $CR_PAT | docker login ghcr.io -u vikiwahyudi12 --password-stdin

docker push ghcr.io/vikiwahyudi12/item-app:latest