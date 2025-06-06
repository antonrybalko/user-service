# Token Rotation & Refresh Tokens

## 1. Overview
`user-service` now uses a **simple dual-token authentication model**:

| Token        | Lifetime   | Purpose                                          |
|--------------|------------|--------------------------------------------------|
| **Access**   | 30 minutes | Sent with every API request in `Authorization`   |
| **Refresh**  | 30 days    | Exchanges for a fresh access token. When used, the old refresh token is **deleted** and a brand-new one is issued. Only **one active refresh token per user** exists at any moment.

Key points  
* **Hard deletion** – tokens are physically removed from the DB (no `isRevoked` flag).  
* **Single session** – logging in or refreshing deletes any previous refresh tokens for that user.  
* **Simple invalidation** – if a refresh token is missing or expired it is simply rejected.

---

## 2. Configuration

| Variable             | Description                                           |
|----------------------|-------------------------------------------------------|
| `JWT_SECRET`         | HMAC secret for access tokens                         |
| `JWT_EXPIRES_IN`     | Access token TTL (seconds) – **`1800`**               |
| `JWT_REFRESH_SECRET` | HMAC secret for refresh tokens (must differ)          |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (seconds) – **`2592000`**               |

---

## 3. API Endpoints

### 3.1 Login – `POST /v1/login`

Returns a **token pair**:

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "accessTokenExpiresAt": "2025-06-01T10:00:00.000Z",
  "refreshTokenExpiresAt": "2025-07-01T10:00:00.000Z",
  "tokenType": "Bearer"
}
```

> Logging in deletes any existing refresh tokens for the user.

### 3.2 Refresh – `POST /v1/refresh`

Body:
```json
{ "refreshToken": "<currentRefreshToken>" }
```

Success `200` → new token pair, old token deleted.

Error codes  

| Code | Message                      | Reason                         |
|------|------------------------------|--------------------------------|
| 400  | Refresh token is required    | Missing field                  |
| 401  | Invalid refresh token        | Token not found / bad signature|
| 401  | Refresh token expired        | > 30 days old                  |

### 3.3 Logout – `POST /v1/logout`

Header `Authorization: Bearer <access>`  
Deletes **all** refresh tokens for current user.

Response:
```json
{ "success": true, "message": "Successfully logged out" }
```


## 7. Error Handling Cheat-Sheet

- **Scenario: 401 on API → access expired**  
  - Action: Call `/v1/refresh`.  
  - Retry the original request with the new access token.

- **Scenario: `/v1/refresh` returns 401**  
  - Action: Force logout.  
  - Clear all tokens from the client.

