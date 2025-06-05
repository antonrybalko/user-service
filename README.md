# User Service

User service for a marketplace. Register customers and vendors, login and get JWT token, manage users and organizations. REST API and CLI.

> **New!**  The service now uses a **dual-token rotation system** (short-lived access token + long-lived rotating refresh token).  
> See the detailed guide in [docs/TOKEN_ROTATION.md](docs/TOKEN_ROTATION.md).

## Install

```bash
yarn global add typescript
yarn install
```

---

## 🐳 Docker

A ready-to-use **docker-compose** stack is provided to spin-up PostgreSQL and the user-service with one command.

### 1. Setup

```bash
# clone repository
git clone https://github.com/antonrybalko/user-service.git
cd user-service

# build & start services in the background
docker compose up -d
```

`docker compose` will

1. Pull/run a `postgres:16` database listening on **localhost:5433**  
2. Build the **user-service** image (using the existing `Dockerfile`)  
3. Mount the project source inside the container for instant hot-reload (`nodemon` watches files).  
4. Execute `db-init/01-init-databases.sql` to create the `user_service` database.  
5. Run TypeORM migrations automatically at container start (via `start-dev.sh`).

### 2. Stopping Services

```bash
# graceful stop
docker compose stop

# or remove containers, keeping data volume
docker compose down
```

To wipe Postgres data completely:

```bash
docker compose down -v        # drops the postgres_data volume
```

### 3. Available Endpoints (default ports)

| Service      | URL / Port        | Purpose                    |
|--------------|-------------------|----------------------------|
| user-service | http://localhost:3001/v1 | REST API root           |
| Health Check | http://localhost:3001/v1 | returns `{ status: "OK" }` |
| Login        | POST /v1/login    | returns access + refresh tokens |
| Refresh      | POST /v1/refresh  | rotates tokens            |
| Logout       | POST /v1/logout   | deletes all refresh tokens |

### 4. Database Access

| Parameter      | Value                |
|----------------|----------------------|
| Host           | `localhost`          |
| Port           | `5433`               |
| Database       | `user_service`       |
| User           | `db_dev_user`        |
| Password       | `db_dev_password`    |

Connect via psql:

```bash
psql -h localhost -p 5433 -U db_dev_user -d user_service
```

Extensions (`uuid-ossp`) are enabled during the init script.

### 5. Development Workflow with Docker

| Task                                    | Command / Action                                                |
|-----------------------------------------|-----------------------------------------------------------------|
| Start stack with hot reload             | `docker compose up -d`                                          |
| View service logs                       | `docker compose logs -f user-service`                           |
| Execute TypeORM migrations manually     | `docker compose exec user-service yarn migration:run:dev`       |
| Revert latest migration                 | `docker compose exec user-service yarn migration:revert:dev`    |
| Install new npm package                 | Add to `package.json` → Docker volume mounts node_modules for dev |
| Run tests inside container              | `docker compose exec user-service yarn test`                    |
| Stop & remove containers                | `docker compose down`                                           |

> **Tip:** During development the code is mounted inside the container, so file changes trigger an automatic restart via `nodemon` (see `start-dev.sh`).

---

## Scripts

```bash
yarn dev
yarn build
yarn cli
yarn test
yarn lint
yarn format
yarn typeorm
yarn migration:run:dev
yarn migration:revert:dev
```

## Migrations

### Generate a migration

```bash
yarn typeorm migration:generate -- src/adapter/persistence/migration/MigrationName -d src/adapter/persistence/data-source.ts
```

### Create a migration

```bash
yarn typeorm migration:create  src/adapter/persistence/migration/MigrationName
```

### Run migrations

```bash
yarn migration:run
```

or

```bash
yarn migration:run:dev
```

### Rollback migrations

```bash
yarn migration:revert:dev
```

or

```
yarn migration:revert
```

# CLI

```bash
yarn cli help
yarn cli users/list
yarn cli register -u user1 -p password123 -e user1@example.com --isVendor
yarn cli orgs/update 123e4567-e89b-12d3-a456-426614174000 -e "neworg@example.com"
yarn cli cleanupTokens
```

# API

### 0. Service status

**Endpoint:** `/v1`  
**Methos:** `GET`
**Response:**
```json
{
  "status": "OK"
}
```

<!-- (rest of README unchanged) -->
