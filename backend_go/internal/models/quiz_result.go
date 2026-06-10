package models

import (
	"time"

	"github.com/google/uuid"
)

type QuizResult struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;index" json:"userId"`
	CourseID    uuid.UUID `gorm:"type:uuid;index" json:"courseId"`
	Score       int       `json:"score"`
	TimeSpent   int       `gorm:"column:time_spent" json:"timeSpent"`
	CompletedAt time.Time `gorm:"column:completed_at" json:"completedAt"`
}

func (QuizResult) TableName() string {
	return "quiz_results"
}
