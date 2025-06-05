-- Database initialization script for user-service

-- Create main database for user-service
-- This database stores user accounts, authentication tokens, and organization data
CREATE DATABASE user_service;

-- Create test database for running automated tests
-- This database is used during test runs to avoid affecting production data
CREATE DATABASE user_service_test;

-- Grant all privileges to the application user
GRANT ALL PRIVILEGES ON DATABASE user_service TO db_dev_user;
GRANT ALL PRIVILEGES ON DATABASE user_service_test TO db_dev_user;

-- Enable UUID extension for generating UUIDs in PostgreSQL
\c user_service
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c user_service_test
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log completion
\echo 'Database initialization completed successfully'
