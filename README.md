# Gymbook

Piattaforma prenotazioni per palestre, scuole di danza e studi fitness — backend Go, app clienti Expo, gestionale web React.

## Struttura

| Cartella | Stack | Ruolo |
|----------|-------|--------|
| `back-end/` | Go, Gin, PostgreSQL | API REST |
| `mobile/` | Expo, React Native | App clienti |
| `web/` | React (CRA) | Gestionale staff |

## Avvio rapido (sviluppo)

### 1. Database e API

```bash
cd back-end
cp .env.example properties.env
docker compose up -d   # PostgreSQL su porta 5433
go run .
```

API: `http://localhost:8080` — Swagger: `http://localhost:8080/swagger/index.html`

**Utente staff di test** (dopo migrazioni): `staff@gymbook.local` / `staff123`

Per promuovere un utente esistente: `UPDATE users SET role = 'staff' WHERE email = 'tua@email.com';`

### 2. Mobile

```bash
cd mobile
cp .env.example .env
npx expo start
```

`EXPO_PUBLIC_API_URL`: `http://10.0.2.2:8080` (emulatore Android) o IP LAN del PC.

### 3. Web gestionale

```bash
cd web
cp .env.example .env
npm start
```

Login staff su `http://localhost:3000/login`

## API principali

- `POST /api/auth/register` · `POST /api/auth/login` → `{ user, access_token }`
- `GET /api/me` (JWT)
- `GET /api/sessions` · `POST /api/bookings` · `GET /api/me/bookings`
- Staff: `POST /api/staff/sessions` · `GET /api/staff/bookings` · `GET /api/staff/members`
