# User Service

User service for a marketplace. Register customers and vendors, login and get JWT token, manage users and organizations. REST API and CLI.

> **New!**  The service now uses a **dual-token rotation system** (short-lived access token + long-lived rotating refresh token).  
> See the detailed guide in [docs/TOKEN_ROTATION.md](docs/TOKEN_ROTATION.md).

## Install

```bash
yarn global add typescript
yarn install
```

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

### 1. Registration API

#### 1.1 Register User

**Endpoint:** `/v1/register`  
**Method:** `POST`  
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "phone": "string",
  "firstname": "string",
  "lastname": "string",
  "isVendor": "boolean"
}
```

**Responses:**
- **201 Created:**
  ```json
  {
    "guid": "string",
    "username": "string",
    "email": "string",
    "firstname": "string",
    "lastname": "string",
    "phone": "string",
    "isVendor": "boolean",
    "status": "string"
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "message": "Validation failed"
  }
  ```
- **409 Conflict:**
  ```json
  {
    "message": "User with this username/email already exists"
  }
  ```

### 2. Login & Tokens API

#### 2.1 Login

**Endpoint:** `/v1/login`  
**Method:** `POST`  
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Responses:**
- **200 OK:**
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string",
    "accessTokenExpiresAt": "2025-06-01T10:00:00.000Z",
    "refreshTokenExpiresAt": "2025-07-01T10:00:00.000Z",
    "tokenType": "Bearer"
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "message": "Validation failed"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "error": "Invalid username or password"
  }
  ```

#### 2.2 Refresh Token

**Endpoint:** `/v1/refresh`  
**Method:** `POST`  
**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Responses:**
- **200 OK:**
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string",
    "accessTokenExpiresAt": "2025-06-01T10:00:00.000Z",
    "refreshTokenExpiresAt": "2025-07-01T10:00:00.000Z",
    "tokenType": "Bearer"
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "error": "Refresh token is required"
  }
  ```
- **401 Unauthorized:** *(examples)*
  ```json
  { "error": "Invalid refresh token" }
  ```
  ```json
  { "error": "Refresh token expired" }
  ```
  ```json
  { "error": "Token reuse detected. All related tokens have been revoked." }
  ```

#### 2.3 Logout

**Endpoint:** `/v1/logout`  
**Method:** `POST`  
**Request Headers:**
- `Authorization: Bearer {accessToken}`

**Responses:**
- **200 OK:**
  ```json
  {
    "success": true,
    "message": "Successfully logged out"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "error": "Unauthorized"
  }
  ```

### 3. Current User Info API

#### 3.1 Get Current User Info

**Endpoint:** `/v1/me`  
**Method:** `GET`  
**Request Headers:**
- `Authorization: Bearer {token}`

**Response:**
- **200 OK:**
  ```json
  {
    "guid": "string",
    "username": "string",
    "firstname": "string",
    "lastname": "string",
    "status": "string",
    "isAdmin": "boolean",
    "isVendor": "boolean",
    "organizations": [
      {
        "guid": "string",
        "title": "string",
        "status": "string"
      }
    ]
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

### 4. Organization Management API
*(unchanged – see previous sections)*

