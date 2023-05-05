# Ylabs Assignment

## Setup

### Install dependencies

```bash
pnpm install
```

### Setup environment variables

```bash
cp .env.example .env
```

### Setup Database

Start the database

```bash
docker-compose up -d
```

Run database migrations

```bash
pnpm run prisma:migrate
```
