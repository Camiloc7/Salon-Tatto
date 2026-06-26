#!/bin/bash

# Configuración
BACKUP_DIR="/ruta/a/tu/proyecto/en/el/vps/backups"
DB_NAME="salon_tatto"
DB_USER="app"
CONTAINER_NAME="salon-postgres-db"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Ejecutar pg_dump dentro del contenedor Docker
echo "Iniciando respaldo de la base de datos..."
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > "$BACKUP_FILE"

# Comprimir el archivo para ahorrar espacio
gzip "$BACKUP_FILE"

# Mantener solo los respaldos de los últimos 7 días (opcional)
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -exec rm {} \;

echo "Respaldo completado: $BACKUP_FILE.gz"
