#!/bin/sh

# Start a PostgreSQL container
DB_CONTAINER_NAME="user_service_db_test"
DB_PORT=5434
DB_USER="db_dev_user"
DB_PASSWORD="db_dev_password"
DB_NAME="user_service_test"

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
  -v $(pwd)/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql \
  postgres:16

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done
echo "PostgreSQL is ready!"

# Install dependencies
yarn global add typescript
yarn install

# Run migrations
echo "Running migrations..."
yarn migration:run:dev

# Run tests
echo "Running tests..."
yarn test --no-coverage
