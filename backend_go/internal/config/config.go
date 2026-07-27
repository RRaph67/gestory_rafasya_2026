package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv            string
	Port              string
	FrontendURL       string
	DatabaseURL       string
	SupabaseJWTSecret string
	SupabaseJWKSURL   string
}

func Load() Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return Config{
		AppEnv:            getEnv("APP_ENV", "development"),
		Port:              getEnv("PORT", "8000"),
		FrontendURL:       getEnv("FRONTEND_URL", "http://localhost:3000"),
		DatabaseURL:       getEnv("DATABASE_URL", ""),
		SupabaseJWTSecret: getEnv("SUPABASE_JWT_SECRET", ""),
		SupabaseJWKSURL:   getEnv("SUPABASE_JWKS_URL", "https://mtefxvmndhqjgykexxug.supabase.co/auth/v1/.well-known/jwks.json"),
	}
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}
