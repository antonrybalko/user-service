#!/bin/sh

# Run migrations
echo "Running migrations..."
yarn migration:run:dev

# Start the application
echo "Starting the application..."
yarn dev
