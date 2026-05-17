# Gymbook Back-end

Questo progetto è un servizio Go containerizzato con pipeline CI/CD su GitHub Actions.

## Struttura del progetto

- `Dockerfile` — build multi-stage per Go
- `.dockerignore` — evita di includere file inutili e segreti nel build context
- `.github/workflows/ci.yml` — pipeline CI/CD per lint, test, build e publish su GHCR
- `docker-compose.yml` — avvia il servizio Go e PostgreSQL in locale

## Prerequisiti

- Go 1.25+
- Docker
- Docker Compose
- GitHub repository

## Build locale dell'immagine Docker

```powershell
cd back-end
docker build -t gymbook-app .
```

## Eseguire il container localmente

Il progetto usa `properties.env` per le variabili d'ambiente locali. Puoi eseguire:

```powershell
docker run --env-file properties.env -p 8080:8080 gymbook-app
```

## Eseguire con Docker Compose

```powershell
docker compose up --build
```

Questo avvierà:
- servizio `db` PostgreSQL su `localhost:5433`
- servizio `app` su `localhost:8080`

> Nota: `docker-compose.yml` imposta `DATABASE_DSN` su `postgres://postgres:postgres@db:5432/gymbook?sslmode=disable`.

## Pipeline GitHub Actions

La pipeline si attiva su push e pull request verso `main` e `develop`.

Passaggi eseguiti:
- `golangci-lint run ./...`
- `go test ./...`
- `go vet ./...`
- build dell'immagine Docker
- push su GitHub Container Registry (`ghcr.io/${{ github.repository_owner }}/gymbook`)

### Pubblicazione su GHCR

La pipeline usa il token `GITHUB_TOKEN` integrato per effettuare il login su `ghcr.io`.

Se vuoi usare un repository GitHub privato o un package registry separato, puoi configurare i secret aggiuntivi nelle impostazioni del repository.

## Branch strategy consigliata

- `main` — produzione
- `develop` — integrazione
- `feature/*` — sviluppo feature

## Note aggiuntive

- Il container runtime non copia `properties.env` nell'immagine per mantenere i segreti fuori dall'immagine.
- Le variabili d'ambiente devono essere fornite al runtime tramite `--env-file` o Docker Compose.
