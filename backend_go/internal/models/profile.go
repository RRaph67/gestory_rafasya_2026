package models

import "github.com/google/uuid"

type Profile struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	FullName  string    `gorm:"column:full_name" json:"fullName"`
	AvatarURL string    `gorm:"column:avatar_url" json:"avatarUrl"`
	IsAdmin   bool      `gorm:"column:is_admin;default:false" json:"isAdmin"`
}

func (Profile) TableName() string {
	return "profiles"
}
