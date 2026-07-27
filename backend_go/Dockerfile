# ── Stage 1: Build ──────────────────────────────────────────────────
FROM golang:1.23-alpine AS builder

RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/api ./cmd/api/main.go

# ── Stage 2: Runtime (minimal image) ────────────────────────────────
FROM alpine:3.19

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/bin/api ./api

# Expose port (Koyeb/Adaptable detect this)
EXPOSE 8000

CMD ["./api"]
