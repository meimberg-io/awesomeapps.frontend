#!/bin/bash
# Traefik and Strapi diagnostic script

echo "=== Docker Container Status ==="
docker ps -a | grep -E 'CONTAINER|traefik|strapi'

echo -e "\n=== Traefik Status ==="
docker ps -a --filter "name=traefik"

echo -e "\n=== Traefik Logs (last 50 lines) ==="
docker logs --tail 50 traefik 2>&1

echo -e "\n=== Strapi Container Status ==="
docker ps -a | grep strapi

echo -e "\n=== Strapi Logs (last 30 lines) ==="
docker logs --tail 30 awesomeapps-strapi 2>&1

echo -e "\n=== Docker Networks ==="
docker network ls | grep traefik

echo -e "\n=== Containers on Traefik Network ==="
docker network inspect traefik --format='{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{"\n"}}{{end}}'

echo -e "\n=== Check if Traefik is listening ==="
netstat -tlnp | grep -E ':80|:443'

echo -e "\n=== Recent Docker Events ==="
docker events --since 10m --until 0s | tail -20

