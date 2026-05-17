-- +migrate Up
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(100),
  cognome VARCHAR(100),
  codice_fiscale VARCHAR(16),
  indirizzo TEXT,
  phone VARCHAR(30),
  birth_date DATE,
  gender VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ux_users_email ON users (lower(email));
CREATE UNIQUE INDEX ux_users_username ON users (lower(username));
CREATE UNIQUE INDEX ux_users_codice_fiscale ON users (codice_fiscale);


