#!/bin/bash
set -e

echo "💾 Iniciando respaldo de la base de datos..."

# Verificar que el contenedor de BD esté corriendo
if ! docker-compose -f docker-compose.prod.yml ps db | grep -q "Up"; then
    echo "❌ El contenedor de base de datos no está corriendo"
    exit 1
fi

# Crear directorio de backups si no existe
mkdir -p ./backups

# Nombre del archivo de backup con timestamp
BACKUP_FILE="./backups/awos_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "📦 Creando backup en: $BACKUP_FILE"

# Realizar backup
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U postgres -d awos > "$BACKUP_FILE"

# Comprimir el backup
gzip "$BACKUP_FILE"

echo "✅ Backup completado: ${BACKUP_FILE}.gz"
echo "📊 Tamaño: $(du -h ${BACKUP_FILE}.gz | cut -f1)"

# Eliminar backups antiguos (mantener últimos 7 días)
echo "🧹 Limpiando backups antiguos (> 7 días)..."
find ./backups -name "awos_backup_*.sql.gz" -mtime +7 -delete

echo "✅ Proceso de backup completado"
