package repository

import (
	"gestory-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type QuizRepository interface {
	CreateResult(result *models.QuizResult) error
}

type quizRepository struct {
	db *gorm.DB
}

func NewQuizRepository(db *gorm.DB) QuizRepository {
	return &quizRepository{db: db}
}

func (r *quizRepository) CreateResult(result *models.QuizResult) error {
	if result.ID == uuid.Nil {
		result.ID = uuid.New()
	}
	return r.db.Create(result).Error
}
