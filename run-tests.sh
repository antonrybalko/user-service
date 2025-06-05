#!/bin/sh

# Start a PostgreSQL container
DB_CONTAINER_NAME="user_service_db"
DB_PORT=5435
DB_USER="db_dev_user"
DB_PASSWORD="db_dev_password"
DB_NAME="user_service"
DB_TEST_NAME="user_service_test"

# Stop and remove any existing container with the same name
if [ $(docker ps -q -f name=$DB_CONTAINER_NAME) ]; then
  echo "Stopping existing container..."
  docker stop $DB_CONTAINER_NAME
fi
if [ $(docker ps -aq -f name=$DB_CONTAINER_NAME) ]; then
  echo "Removing existing container..."
  docker rm $DB_CONTAINER_NAME
fi

# Start a new PostgreSQL container
echo "Starting PostgreSQL container..."
docker run -d \
  --name $DB_CONTAINER_NAME \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_USER=$DB_USER \
  -e POSTGRES_DB=postgres \
  -p $DB_PORT:5432 \
  -v $(pwd)/db-init:/docker-entrypoint-initdb.d \
  postgres:16

# Initialize the database
echo "Initializing the database..."
docker exec -i $DB_CONTAINER_NAME psql -U $DB_USER -d postgres < db-init/01-init-databases.sql

# Install dependencies
yarn global add typescript
yarn install

# Run tests
echo "Running tests..."
yarn test --no-coverage
