# Token Rotation & Refresh Tokens

## 1. Overview
`user-service` now authenticates with **dual tokens**:

| Token | Lifetime | Purpose |
|-------|----------|---------|
| **Access** | 30 minutes | Sent with every API request in `Authorization: Bearer …` |
| **Refresh** | 30 days | Exchanges for a fresh access token and **rotates** itself |

Key concepts  
* **Rotation** – every successful refresh invalidates the old refresh token and returns a brand-new one from the same *family*.  
* **Families** – all rotated tokens for one login share a `family` UUID. Re-using a revoked/expired token invalidates the whole family.  
* **Revocation** – logout or reuse detection sets `isRevoked = true` in DB, instantly blocking further use.

---

## 2. Configuration

Add / update these variables in **.env** (or your secrets store):

| Variable | Description |
|----------|-------------|
| `JWT_SECRET`            | HMAC secret for **access** tokens |
| `JWT_EXPIRES_IN`        | Access token TTL in seconds – **`1800`** |
| `JWT_REFRESH_SECRET`    | HMAC secret for **refresh** tokens (must differ from `JWT_SECRET`) |
| `DB_*`                  | Unchanged |

---

## 3. API Endpoints

### 3.1 Login – `POST /v1/login`

Request
```json
{ "username": "alice", "password": "P@ssw0rd" }
```

Response `200`
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...RFR",
  "accessTokenExpiresAt": "2025-06-01T10:00:00.000Z",
  "refreshTokenExpiresAt": "2025-07-01T10:00:00.000Z",
  "tokenType": "Bearer"
}
```
*Breaking change: login no longer returns a single token.*

### 3.2 Refresh – `POST /v1/refresh`

Body
```json
{ "refreshToken": "<currentRefreshToken>" }
```

Success `200` – **new token pair**

Errors  
| Code | Message | Reason |
|------|---------|--------|
| 400  | Refresh token is required | Missing body field |
| 401  | Invalid refresh token | Signature/format error |
| 401  | Refresh token expired | > 30 days |
| 401  | Token reuse detected. All related tokens have been revoked. | Old token replayed |

### 3.3 Logout – `POST /v1/logout`

Header `Authorization: Bearer <access>`  
Revokes **all** refresh tokens for current user.

Response `200`
```json
{ "success": true, "message": "Successfully logged out" }
```

---

## 4. Token Expiration

```
login ──▶ 30 min ── access expires
        │
        └─▶ 30 days ── refresh expires (absolute, not extended by rotation)
```

---

## 5. Security Features

* **Short-lived access tokens** (30 min) reduce blast radius.  
* **Rotating refresh tokens** (30 days) minimise theft window while keeping UX smooth.  
* **Token families** – group all refresh tokens from a session.  
* **Reuse detection** – replaying a revoked token revokes the *entire* family.  
* **Server-side revocation** – DB flag allows instant logout / admin disable.  
* **Separate signing secrets** for access and refresh tokens.

---

## 6. Client Integration Examples

### JavaScript (fetch)
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
  if (r.status === 401) {          // access expired
    await refresh();               // <- get new pair
    return api(path, opts);        // retry
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

### cURL
```bash
curl -X POST http://localhost:3001/v1/refresh \
     -H "Content-Type: application/json" \
     -d '{"refreshToken":"<token>"}'
```

**Storage advice**  
* Store refresh token in **http-only, Secure, SameSite=strict** cookie when possible.  
* Never put tokens in query params.

---

## 7. Error Handling Cheat-Sheet

| Scenario | Recommended UX |
|----------|----------------|
| **401** on API → access expired | Call `/v1/refresh`, retry original request |
| `/v1/refresh` returns **401 Invalid / Expired** | Force logout, clear local tokens |
| `/v1/refresh` returns **reuse detected** | Treat as compromise, force password reset |

---

## 8. Operational Considerations

### DB Cleanup
CLI command `yarn cli cleanupTokens` removes expired refresh tokens:
```bash
# daily cron
node dist/src/presentation/cli/cli.js cleanupTokens
```

### Monitoring
* Alert on spikes in **reuse detected** 401s.  
* Track refresh failures / success ratio.

---

## 9. Migrating from Single-Token System

1. **Deploy DB migration** – adds `refresh_token` table.  
2. **Set `JWT_REFRESH_SECRET`** in all environments.  
3. **Deploy new service** – old clients will break (no backward compatibility).  
4. **Update clients** to:
   * Handle `accessToken` + `refreshToken`
   * Call `/v1/refresh` on 401
   * Store tokens securely  
5. Optionally revoke all existing access tokens on release.

---

## 10. Best Practices Checklist

- [x] HTTPS everywhere  
- [x] Store refresh token in secure, http-only cookie  
- [x] Limit refresh attempts per minute  
- [x] Rotate secrets periodically & force logout  
- [x] Use Content-Security-Policy to prevent XSS stealing tokens  

---

© 2025 · `user-service` Token Rotation
