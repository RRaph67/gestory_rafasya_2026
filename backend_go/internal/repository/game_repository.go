package repository

import (
	"gestory-backend/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GameRepository interface {
	Create(score *models.GameScore) error
	GetTopScores(limit int) ([]models.GameScore, error)
}

type gameRepository struct {
	db *gorm.DB
}

func NewGameRepository(db *gorm.DB) GameRepository {
	return &gameRepository{db: db}
}

func (r *gameRepository) Create(score *models.GameScore) error {
	if score.ID == uuid.Nil {
		score.ID = uuid.New()
	}
	return r.db.Create(score).Error
}

func (r *gameRepository) GetTopScores(limit int) ([]models.GameScore, error) {
	var scores []models.GameScore
	err := r.db.Order("score DESC, completed_at ASC").Limit(limit).Find(&scores).Error
	return scores, err
}
