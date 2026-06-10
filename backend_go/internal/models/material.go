package models

import "github.com/google/uuid"

type Material struct {
	ID         uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	CourseID   uuid.UUID `gorm:"type:uuid;index" json:"courseId"`
	Title      string    `gorm:"not null" json:"title"`
	Type       string    `gorm:"not null" json:"type"`
	Content    string    `json:"content,omitempty"`
	URL        string    `gorm:"column:url" json:"url,omitempty"`
	OrderIndex int       `gorm:"column:order_index;not null" json:"orderIndex"`
}

func (Material) TableName() string {
	return "materials"
}
