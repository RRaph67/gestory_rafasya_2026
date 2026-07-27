package database

import (
	"errors"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect(databaseURL string) (*gorm.DB, error) {
	if databaseURL == "" {
		return nil, errors.New("DATABASE_URL is required")
	}

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  databaseURL,
		PreferSimpleProtocol: true, // Nonaktifkan prepared statements untuk kompabilitas Supabase PgBouncer (Port 6543)
	}), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}
