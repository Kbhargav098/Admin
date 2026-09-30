#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma db push

echo "Seeding initial data..."
npm run seed

echo "Starting server..."
exec node dist/main.js
