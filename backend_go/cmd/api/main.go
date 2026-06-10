package main

import (
	"log"

	"gestory-backend/internal/config"
	"gestory-backend/internal/database"
	"gestory-backend/internal/routes"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("connect database: %v", err)
	}

	router := routes.NewRouter(cfg, db)

	log.Printf("Gestory API running on :%s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("run server: %v", err)
	}
}
