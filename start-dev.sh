#!/bin/sh

npm install -g typescript
npm install

# Run migrations
echo "Running migrations..."
npm run migration:run:dev

# Start the application
echo "Starting the application..."
npm run dev
