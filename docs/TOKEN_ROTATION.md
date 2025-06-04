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

---

## 4. Token Expiration Timeline
```
login ──▶ 30 min ── access expires
        │
        └─▶ 30 days ── refresh expires
```
Refresh does **not** extend the 30-day limit.

---

## 5. Security Features

* **Hard deletion** – no soft-revocation flags; removed tokens cannot be replayed.  
* **Single active session** – one refresh token per user, replaced on login/refresh.  
* **Short-lived access tokens** – 30 min reduces exposure window.  
* **Separate signing secrets** – distinct keys for access and refresh tokens.

---

## 6. Client Integration (Fetch Example)

```ts
async function login(u, p) {
  const r = await fetch('/v1/login', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({username:u, password:p})
  });
  saveTokens(await r.json());
}

async function api(path, opts={}) {
  const r = await fetch(path, {
    ...opts,
    headers:{...(opts.headers||{}), Authorization:`Bearer ${getAccess()}`}
  });
  if (r.status === 401) { // access expired
    await refresh();
    return api(path, opts);
  }
  return r.json();
}

async function refresh() {
  const r = await fetch('/v1/refresh', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({refreshToken:getRefresh()})
  });
  if (r.status !== 200) throw new Error('Session expired');
  saveTokens(await r.json());
}
```

Store the refresh token in a **secure, http-only cookie** when possible.

---

## 7. Error Handling Cheat-Sheet

| Scenario                        | Recommended UX                          |
|---------------------------------|-----------------------------------------|
| 401 on API → access expired     | Call `/v1/refresh`, retry original req. |
| `/v1/refresh` returns 401       | Force logout, clear tokens.             |

---

## 8. Operational Considerations

* **Migration** – run the `refresh_token` table migration (`1735000000000`) once.  
* **Expired token cleanup** – daily cron: `yarn cli cleanupTokens`.  
* **Monitoring** – track refresh failure rate; investigate spikes.

---

© 2025 · `user-service` Token Rotation (Simplified)
