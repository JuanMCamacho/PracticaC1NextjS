#!/bin/bash
set -e

echo "🚀 Iniciando despliegue en producción..."

# Verificar que existe .env.production
if [ ! -f .env.production ]; then
    echo "❌ Error: Archivo .env.production no encontrado"
    echo "📝 Copia .env.production.example y configura tus variables"
    exit 1
fi

# Cargar variables de entorno
export $(cat .env.production | grep -v '^#' | xargs)

echo "🔨 Construyendo imágenes de Docker..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🛑 Deteniendo contenedores anteriores..."
docker-compose -f docker-compose.prod.yml down

echo "🚢 Iniciando servicios de producción..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 15

echo "🔍 Verificando estado de los servicios..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ Despliegue completado!"
echo "📊 Ver logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Detener: docker-compose -f docker-compose.prod.yml down"
