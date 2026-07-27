package models

import (
	"time"

	"github.com/google/uuid"
)

type GameScore struct {
	ID                uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PlayerName        string    `gorm:"column:player_name;not null" json:"playerName"`
	Score             int       `gorm:"column:score;not null" json:"score"`
	QuestionsAnswered int       `gorm:"column:questions_answered" json:"questionsAnswered"`
	CorrectAnswers    int       `gorm:"column:correct_answers" json:"correctAnswers"`
	Accuracy          float64   `gorm:"column:accuracy" json:"accuracy"`
	TimeSpent         int       `gorm:"column:time_spent" json:"timeSpent"`
	CompletedAt       time.Time `gorm:"column:completed_at;default:now()" json:"completedAt"`
}

func (GameScore) TableName() string {
	return "game_scores"
}
