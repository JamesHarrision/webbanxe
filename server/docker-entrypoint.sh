#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Waiting for database to be ready..."
# Simple check for database connectivity (optional but recommended)
# while ! nc -z db 3306; do sleep 1; done

echo "Running Prisma migrations..."
# Run migrations to update the database schema
npx prisma migrate deploy

# If there's a seed script, uncomment the line below
# npx prisma db seed

echo "Starting application..."
# Execute the main container command
exec "$@"
