#!/bin/bash
set -e

echo "🔄 Actualizando aplicación en producción..."

# Verificar que los servicios estén corriendo
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "❌ Los servicios no están corriendo. Ejecuta ./deploy.sh primero"
    exit 1
fi

echo "📥 Descargando últimos cambios..."
git pull origin main

echo "🔨 Reconstruyendo imagen web..."
docker-compose -f docker-compose.prod.yml build web

echo "🔄 Reiniciando servicio web sin downtime..."
docker-compose -f docker-compose.prod.yml up -d --no-deps web

echo "⏳ Esperando que el servicio esté listo..."
sleep 10

echo "🔍 Verificando salud del servicio..."
if docker-compose -f docker-compose.prod.yml ps web | grep -q "healthy"; then
    echo "✅ Actualización completada exitosamente!"
else
    echo "⚠️  Servicio iniciado, verificando logs..."
    docker-compose -f docker-compose.prod.yml logs --tail=20 web
fi

echo "📊 Ver logs completos: docker-compose -f docker-compose.prod.yml logs -f web"
