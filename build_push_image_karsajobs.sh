#!/bin/bash

IMAGE_NAME="ghcr.io/vikiwahyudi12/karsajobs:latest"

echo "=== Memulai Proses Build & Push Image Backend ==="

echo "[1/4] Building Docker Image..."
docker build -t $IMAGE_NAME .

echo "[2/4] Listing Docker Images..."
docker images | grep karsajobs

echo "[3/4] Logging in to GitHub Container Registry..."
echo $CR_PAT | docker login ghcr.io -u vikiwahyudi12 --password-stdin

echo "[4/4] Pushing Image to GitHub Packages..."
docker push $IMAGE_NAME

echo "=== Selesai! Image Backend berhasil di-push. ==="