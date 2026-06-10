package models

import (
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type QuizQuestion struct {
	ID            uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CourseID      uuid.UUID      `gorm:"type:uuid;index" json:"courseId"`
	Question      string         `gorm:"not null" json:"question"`
	Options       datatypes.JSON `gorm:"type:jsonb" json:"options"`
	CorrectAnswer string         `gorm:"column:correct_answer" json:"correctAnswer"`
	Explanation   string         `json:"explanation"`
	Difficulty    string         `json:"difficulty"`
}

func (QuizQuestion) TableName() string {
	return "quiz_questions"
}
