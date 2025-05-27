# User Service

User service for a marketplace. Register customers and vendors, login and get JWT token, manage users and organizations. REST API and CLI.

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

### 2. Login API

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
    "token": "string"
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
      },
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

#### 4.1 Create Organization

**Endpoint:** `/v1/me/organizations`  
**Method:** `POST`  
**Request Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "string",
  "cityGuid": "string",
  "phone": "string",
  "email": "string",
  "registrationNumber": "string"
}
```

**Responses:**
- **201 Created:**
  ```json
  {
    "guid": "string",
    "title": "string",
    "cityGuid": "string",
    "phone": "string",
    "email": "string",
    "registrationNumber": "string",
    "published": "string",
    "status": "string"
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
    "message": "Authentication required"
  }
  ```

#### 4.2 Update Organization

**Endpoint:** `/v1/me/organizations/{guid}`  
**Method:** `PUT`  
**Request Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "string",
  "cityGuid": "string",
  "phone": "string",
  "email": "string",
  "registrationNumber": "string",
  "published": "string",
  "status": "string"
}
```

**Responses:**
- **200 OK:**
  ```json
  {
    "guid": "string",
    "title": "string",
    "cityGuid": "string",
    "phone": "string",
    "email": "string",
    "registrationNumber": "string",
    "published": "string",
    "status": "string"
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
    "message": "Authentication required"
  }
  ```

### 5. User Management API

#### 5.1 Get All Users

**Endpoint:** `/v1/users`  
**Method:** `GET`  
**Request Headers:**
- `Authorization: Bearer {token}`

**Response:**
- **200 OK:**
  ```json
  [
    {
      "guid": "string",
      "username": "string",
      "firstname": "string",
      "lastname": "string",
      "email": "string",
      "phone": "string",
      "isAdmin": "boolean",
      "isVendor": "boolean",
      "status": "integer"
    }
  ]
  ```
- **401 Unauthorized:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

#### 5.2 Get User by GUID

**Endpoint:** `/v1/users/{guid}`  
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
    "email": "string",
    "phone": "string",
    "isAdmin": "boolean",
    "isVendor": "boolean",
    "status": "integer"
  }
  ```
- **404 Not Found:**
  ```json
  {
    "message": "User with GUID {guid} does not exist"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

#### 5.3 Update User

**Endpoint:** `/v1/users/{guid}`  
**Method:** `PUT`  
**Request Headers:**
- `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "phone": "string",
  "firstname": "string",
  "lastname": "string",
  "isAdmin": "boolean",
  "isVendor": "boolean",
  "status": "integer"
}
```

**Responses:**
- **200 OK:**
  ```json
  {
    "guid": "string",
    "username": "string",
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "phone": "string",
    "isAdmin": "boolean",
    "isVendor": "boolean",
    "status": "integer"
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "message": "Validation failed"
  }
  ```
- **404 Not Found:**
  ```json
  {
    "message": "User with GUID {guid} does not exist"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

#### 5.4 Delete User

**Endpoint:** `/v1/users/{guid}`  
**Method:** `DELETE`  
**Request Headers:**
- `Authorization: Bearer {token}`

**Response:**
- **200 OK:**
  ```json
  {
    "message": "User deleted successfully"
  }
  ```
- **404 Not Found:**
  ```json
  {
    "message": "User with GUID {guid} does not exist"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "message": "Authentication required"
  }
  ```
