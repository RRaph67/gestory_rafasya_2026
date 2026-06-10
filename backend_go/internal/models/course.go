package models

import "github.com/google/uuid"

type Course struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Slug        string    `gorm:"uniqueIndex;not null" json:"slug"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `json:"description"`
	ImageURL    string    `gorm:"column:image_url" json:"imageUrl"`

	Materials     []Material     `gorm:"foreignKey:CourseID" json:"materials,omitempty"`
	QuizQuestions []QuizQuestion `gorm:"foreignKey:CourseID" json:"quizQuestions,omitempty"`
}

func (Course) TableName() string {
	return "courses"
}
