package config

import (
	"os"
)

type Config struct {
	AppEnv      string
	AppPort     string
	DatabaseDSN string
	JwtSecret   string
}

func Load() *Config {
	return &Config{
		AppEnv:      os.Getenv("APP_ENV"),
		AppPort:     os.Getenv("APP_PORT"),
		DatabaseDSN: os.Getenv("DATABASE_DSN"),
		JwtSecret:   os.Getenv("JWT_SECRET"),
	}
}
