#!/bin/bash

# Configuración
EXPORT_DIR="/ruta/a/tu/proyecto/en/el/vps/exports"
DB_NAME="salon_tatto"
DB_USER="app"
CONTAINER_NAME="salon-postgres-db"
DATE=$(date +"%Y%m%d_%H%M%S")

# Crear directorio de exportación si no existe
mkdir -p "$EXPORT_DIR"

if [ -z "$1" ]; then
  echo "Por favor, especifica el nombre de la tabla que deseas exportar."
  echo "Uso: ./db-export-csv.sh <nombre_de_tabla>"
  echo "Ejemplo: ./db-export-csv.sh users"
  exit 1
fi

TABLE_NAME=$1
EXPORT_FILE="$EXPORT_DIR/${TABLE_NAME}_$DATE.csv"

echo "Exportando la tabla '$TABLE_NAME' a CSV..."

# Usar el comando \copy de psql dentro de Docker para generar el CSV
docker exec -t $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "\copy (SELECT * FROM \"$TABLE_NAME\") TO STDOUT WITH CSV HEADER" > "$EXPORT_FILE"

if [ $? -eq 0 ]; then
  echo "Exportación exitosa: $EXPORT_FILE"
else
  echo "Error al exportar la tabla. Asegúrate de que la tabla '$TABLE_NAME' exista."
  # Limpiar archivo vacío si falló
  rm -f "$EXPORT_FILE"
fi
