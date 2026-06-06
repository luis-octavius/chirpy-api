# Chirpy API
This is a guided project of [Boot.dev](boot.dev) to create an API that mimics the Twitter API. This API has Authentication and Authorization, using JWT, Refresh Tokens and Argon2id. 

# How to run  
1. First, copy `.env` file and fill it:

```bash
cp .env.example .env
```

2. Install: 
```bash 
npm install 
```

3. Run it: 
```bash
npm run dev
```

4. (Optional) You can run the tests with:
```bash 
npm run test
```

# Endpoints

## Users

### Create User
```
POST /api/users
```

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response (201):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isChirpyRed": false
}
```

### Login
```
POST /api/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "isChirpyRed": false,
  "token": "jwt_access_token",
  "refreshToken": "refresh_token"
}
```

### Update User
```
PUT /api/users
Authorization: Bearer <access_token>
```

Request:
```json
{
  "email": "newemail@example.com",
  "password": "newpassword"
}
```

Response (200):
```json
{
  "id": "uuid",
  "email": "newemail@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z",
  "isChirpyRed": false
}
```

### Refresh Token
```
POST /api/refresh
Authorization: Bearer <refresh_token>
```

Response (200):
```json
{
  "token": "new_jwt_access_token"
}
```

### Revoke Refresh Token
```
POST /api/revoke
Authorization: Bearer <refresh_token>
```

Response (204): No content

## Chirps

### Create Chirp
```
POST /api/chirps
Authorization: Bearer <access_token>
```

Request:
```json
{
  "body": "This is my chirp message (max 140 characters)"
}
```

Response (201):
```json
{
  "id": "uuid",
  "body": "This is my chirp message",
  "userId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Get All Chirps
```
GET /api/chirps
```

Response (200):
```json
[
  {
    "id": "uuid",
    "body": "Chirp message",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Chirp by ID
```
GET /api/chirps/{chirpId}
```

Response (200):
```json
{
  "id": "uuid",
  "body": "Chirp message",
  "userId": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Delete Chirp
```
DELETE /api/chirps/{chirpId}
Authorization: Bearer <access_token>
```

Response (204): No content

## Admin Endpoints

### Get Metrics
```
GET /admin/metrics
```

Response (200):
HTML page showing metrics

### Reset Database
```
POST /admin/reset
```

Requires: Development environment only

Response (200):
```json
"Users deleted successfully"
```

## Other

### Health Check
```
GET /api/healthz
```

Response (200):
```json
{
  "status": "ok"
}
```

### Polka Webhook
```
POST /api/polka/webhooks
Authorization: ApiKey <api_key>
```

Request:
```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "uuid"
  }
}
```

Response (204): No content

## Authentication

The API uses JWT for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Endpoints that require authentication will return a 401 Unauthorized error if the token is missing or invalid.

## Error Handling

Common error responses:

- 400 Bad Request: Invalid input or request format
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: User lacks permission for the action
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error
