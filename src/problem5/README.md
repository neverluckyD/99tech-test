# Problem 5 — CRUD API with Express, TypeScript, Prisma & Supabase

A production-ready RESTful API scaffold implementing a **Resource** entity with full CRUD, pagination, search, validation, and structured error handling.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Language | TypeScript 5 (strict mode) |
| Framework | Express 4 |
| ORM | Prisma 5 |
| Database | PostgreSQL (via Supabase) |
| Validation | Zod |
| Logging | Winston |
| Testing | Jest + Supertest |
| Containerisation | Docker / Docker Compose |

---

## Project Structure

```
src/
├── app.ts               # Express app factory
├── server.ts            # Entry point & graceful shutdown
├── config/              # env, prisma, supabase clients
├── modules/resource/    # Feature module (controller → service → repository)
│   └── dto/             # Input DTOs
├── middleware/          # error, not-found, validate
├── utils/               # api-response, logger, pagination
├── constants/           # http-status codes
├── types/               # express augmentation, common types
└── routes/              # Central route registry
prisma/
├── schema.prisma
└── migrations/
tests/
├── unit/
└── integration/
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

### 3. Run database migrations

```bash
npm run db:migrate
```

### 4. Start development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api-docs` | Interactive Swagger UI |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/resources` | List resources (paginated) |
| `GET` | `/api/resources/:id` | Get resource by ID |
| `POST` | `/api/resources` | Create resource |
| `PUT` | `/api/resources/:id` | Update resource |
| `DELETE` | `/api/resources/:id` | Delete resource |

> **Interactive Documentation**: You can access the full API documentation and test endpoints via Swagger UI at `http://localhost:3000/api-docs`.

### Query Parameters (GET /api/resources)

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page (max 100) |
| `search` | string | — | Search by name / description |
| `sortBy` | string | `createdAt` | Field to sort by |
| `sortOrder` | `asc\|desc` | `desc` | Sort direction |

---

## Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Compile TypeScript → dist/
npm start            # Run compiled output
npm test             # Run all tests
npm run lint         # Lint source files
npm run format       # Format source files
npm run db:generate  # Regenerate Prisma client
npm run db:migrate   # Run pending migrations (dev)
npm run db:studio    # Open Prisma Studio
```

---

## Docker

```bash
# Production build
docker compose up --build

# With local Postgres
docker compose --profile local up --build
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` / `production` / `test` |
| `PORT` | HTTP port (default `3000`) |
| `DATABASE_URL` | Prisma connection string |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (server-only) |
| `CORS_ORIGIN` | Allowed CORS origin |
| `DEFAULT_PAGE_SIZE` | Default pagination size |
| `MAX_PAGE_SIZE` | Maximum pagination size |
