#!/bin/bash

# Run migrations
echo "Running migrations..."
npm run migration:run:dev

# Start the application
echo "Starting the application..."
npm run dev
