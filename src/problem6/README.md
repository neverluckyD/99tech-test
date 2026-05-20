# Real-Time Scoreboard API Service Specification

## Overview

This module provides a secure and scalable backend service for maintaining a real-time scoreboard system.

The service is responsible for:

- Receiving score update requests from authenticated users
- Validating and authorizing score-changing actions
- Updating user scores safely
- Broadcasting live scoreboard updates
- Preventing malicious score manipulation
- Returning the top 10 users in real time

The module is intended to be implemented as part of a backend API service.

---

# Goals

## Functional Requirements

1. Maintain a live scoreboard of top 10 users
2. Support real-time updates
3. Increase user score after a valid action
4. Prevent unauthorized score modifications
5. Ensure data consistency under concurrent requests

## Non-Functional Requirements

- Low latency
- Horizontally scalable
- Secure against replay attacks and forged requests
- Fault tolerant
- Observable and monitorable

---

# High-Level Architecture

```text
Client Application
        |
        v
API Gateway / Load Balancer
        |
        v
Application Server
 ├── Authentication Middleware
 ├── Action Validation Service
 ├── Score Service
 ├── Leaderboard Service
 └── WebSocket Gateway
        |
        v
Database (PostgreSQL / Redis)
```

---

# Core Components

## 1. Authentication Middleware

### Responsibilities

- Validate access tokens (JWT/OAuth2)
- Identify authenticated user
- Reject unauthorized requests

### Requirements

- All score update endpoints MUST require authentication
- Tokens SHOULD expire
- Refresh token flow SHOULD be supported

---

## 2. Action Validation Service

### Responsibilities

Verify whether a score increment request is legitimate.

### Security Rules

The backend MUST NOT trust the client directly.

The client MUST send:

```json
{
  "actionId": "uuid",
  "actionType": "GAME_WIN",
  "timestamp": 1747032000,
  "signature": "hashed_payload"
}
```

### Validation Checks

| Validation | Description |
|---|---|
| Authenticated user | Request must belong to logged-in user |
| Action uniqueness | `actionId` must not already exist |
| Timestamp validity | Prevent replay attacks |
| Signature validation | Ensure request integrity |
| Action eligibility | Ensure action is allowed |
| Rate limiting | Prevent abuse |

### Replay Attack Prevention

Store processed `actionId` values for a configurable duration.

Example:

```text
actionId -> Redis SETNX
```

If already exists:

```http
409 Conflict
```

---

## 3. Score Service

### Responsibilities

- Increment scores atomically
- Persist score history
- Publish leaderboard update events

### Database Requirements

Score updates MUST be atomic.

Example SQL:

```sql
UPDATE users
SET score = score + :increment
WHERE id = :userId;
```

OR

```sql
SELECT ... FOR UPDATE
```

### Recommended Data Model

## `users`

| Column | Type |
|---|---|
| id | UUID |
| username | VARCHAR |
| score | BIGINT |
| updated_at | TIMESTAMP |

## `score_events`

| Column | Type |
|---|---|
| id | UUID |
| user_id | UUID |
| action_id | UUID |
| score_delta | INTEGER |
| created_at | TIMESTAMP |

---

## 4. Leaderboard Service

### Responsibilities

- Retrieve top 10 users
- Cache leaderboard data
- Push live updates

### Recommended Storage

Use Redis Sorted Sets for fast ranking.

Example:

```text
ZADD leaderboard score userId
ZREVRANGE leaderboard 0 9 WITHSCORES
```

### Synchronization Strategy

After successful score update:

1. Update primary database
2. Update Redis leaderboard
3. Publish leaderboard event

---

## 5. Real-Time Update Gateway

### Recommended Technology

- WebSocket
- Socket.IO
- Server-Sent Events (SSE)

### Responsibilities

- Broadcast leaderboard changes
- Maintain active client subscriptions

### Event Example

```json
{
  "event": "leaderboard.updated",
  "data": {
    "top10": [
      {
        "userId": "123",
        "username": "Alice",
        "score": 9000
      }
    ]
  }
}
```

---

# API Specification

# 1. Submit Action

## Endpoint

```http
POST /api/v1/actions/complete
```

## Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Request

```json
{
  "actionId": "2f8d2f51-2db7-4f3c-a14b-1e0a5a2f91f0",
  "actionType": "GAME_WIN",
  "timestamp": 1747032000,
  "signature": "hmac_sha256"
}
```

## Success Response

```json
{
  "success": true,
  "newScore": 1500
}
```

## Error Responses

| Status | Reason |
|---|---|
| 401 | Unauthorized |
| 403 | Invalid signature |
| 409 | Duplicate action |
| 429 | Rate limited |

---

# 2. Get Leaderboard

## Endpoint

```http
GET /api/v1/leaderboard
```

## Response

```json
{
  "top10": [
    {
      "rank": 1,
      "userId": "123",
      "username": "Alice",
      "score": 9999
    }
  ]
}
```

---

# Execution Flow Diagram

```text
 ┌────────────────────┐
 │     User Action    │
 └─────────┬──────────┘
           |
           v
 ┌────────────────────┐
 │ Client Sends API   │
 │ Request w/ Token   │
 └─────────┬──────────┘
           |
           v
 ┌────────────────────┐
 │ Authentication     │
 │ Middleware         │
 └─────────┬──────────┘
           |
           v
 ┌────────────────────┐
 │ Validate Action    │
 │ - Signature        │
 │ - Replay Check     │
 │ - Rate Limit       │
 └─────────┬──────────┘
           |
           v
 ┌────────────────────┐
 │ Atomic Score       │
 │ Update             │
 └─────────┬──────────┘
           |
           v
 ┌────────────────────┐
 │ Update Redis       │
 │ Leaderboard Cache  │
 └─────────┬──────────┘
           |
           v
 ┌────────────────────┐
 │ Publish Real-Time  │
 │ Leaderboard Event  │
 └─────────┬──────────┘
           |
           v
 ┌────────────────────┐
 │ Clients Receive    │
 │ Live Update        │
 └────────────────────┘
```

---

# Security Considerations

## Never Trust Client-Side Score Values

The client MUST NEVER send:

```json
{
  "score": 999999
}
```

Score increments MUST be calculated server-side.

---

## Use Signed Requests

Recommended:

```text
HMAC_SHA256(secret, payload)
```

This helps prevent tampering.

---

## Rate Limiting

Recommended limits:

| Endpoint | Limit |
|---|---|
| Submit Action | 10 req/sec/user |
| Leaderboard | 30 req/sec/IP |

---

## Replay Protection

Each action request MUST contain:

- unique action ID
- timestamp
- expiration window

Example validity:

```text
Request expires after 30 seconds
```

---

## Audit Logging

Log all score updates:

```text
userId
actionId
ipAddress
deviceId
scoreDelta
timestamp
```

---

# Scalability Recommendations

## Recommended Stack

| Component | Technology |
|---|---|
| API Server | Node.js + Express/NestJS |
| Database | PostgreSQL |
| Cache | Redis |
| Realtime | Socket.IO/WebSocket |
| Queue | Kafka/RabbitMQ (optional) |

---

## Horizontal Scaling

The application SHOULD be stateless.

Shared resources:

- Redis
- PostgreSQL
- Event bus

---

## Event-Driven Improvements (Future)

The service MAY evolve toward event sourcing.

Example:

```text
Action Completed
    -> Score Updated
    -> Leaderboard Updated
    -> Analytics Updated
```

Benefits:

- better observability
- replay capability
- analytics support
- decoupled architecture

---

# Failure Handling

| Failure | Strategy |
|---|---|
| Redis unavailable | Fallback to DB |
| WebSocket disconnected | Client reconnect |
| Duplicate requests | Idempotency handling |
| DB transaction failure | Rollback |

---

# Monitoring & Observability

Recommended metrics:

| Metric | Purpose |
|---|---|
| API latency | Performance |
| Failed validations | Detect attacks |
| Duplicate action rate | Replay detection |
| WebSocket connections | Capacity monitoring |
| Score update throughput | Scaling visibility |

Recommended tools:

- Prometheus
- Grafana
- OpenTelemetry

---

# Suggested Improvements

## 1. Anti-Cheat Engine

Future enhancement:

- anomaly detection
- impossible score velocity detection
- behavioral analysis

Example:

```text
User gained 10,000 points in 5 seconds
```

Automatically flag suspicious activity.

---

## 2. Idempotency Keys

Support explicit idempotency keys for safer retries.

---

## 3. CQRS Separation

Split:

- write service (score updates)
- read service (leaderboard queries)

Improves scalability for high traffic systems.

---

## 4. Regional Leaderboards

Possible extensions:

- global leaderboard
- country leaderboard
- weekly/monthly seasons

---

# Acceptance Criteria

The implementation is considered complete when:

- Users can securely increase scores
- Top 10 leaderboard updates in real time
- Duplicate/replayed actions are rejected
- Unauthorized users cannot modify scores
- Concurrent score updates remain consistent
- System scales horizontally
- Real-time updates are delivered within acceptable latency (<1 second recommended)

---

# Summary

This module provides:

- secure score processing
- real-time leaderboard updates
- replay protection
- scalable architecture
- production-ready backend design

The specification is intentionally implementation-oriented so a backend engineering team can directly begin development and system design discussions.
