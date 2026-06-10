# Gestory Backend

Backend REST API untuk Gestory, dibangun dengan Go, Gin, GORM, dan Supabase Postgres.

## Struktur

```txt
cmd/api              entry point
internal/config      environment config
internal/database    GORM connection
internal/models      database models
internal/dto         request/response contracts
internal/repository  database access
internal/service     business logic
internal/handler     Gin HTTP handlers
internal/routes      route wiring
internal/middleware  auth middleware
internal/response    API response helper
migrations           Supabase SQL migrations
seeds                initial data
```

## Setup

1. Copy env:

```bash
cp .env.example .env
```

2. Isi `DATABASE_URL` dari Supabase Postgres.

3. Jalankan SQL berikut di Supabase SQL Editor:

```txt
migrations/001_gestory_schema.sql
seeds/001_gestory_seed.sql
```

4. Install dependencies:

```bash
go mod tidy
```

5. Run server:

```bash
go run ./cmd/api
```

API berjalan di `http://localhost:8000`.

## Endpoint

```txt
GET  /api/v1/health
GET  /api/v1/courses
GET  /api/v1/courses/:slug
GET  /api/v1/courses/:slug/materials
GET  /api/v1/courses/:slug/questions
GET  /api/v1/quiz/:slug/questions
POST /api/v1/quiz/submit
GET  /api/v1/game/questions?courseId=bab-1
```

## Frontend Env

Di `gestory/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_USE_MOCK_API=false
```
