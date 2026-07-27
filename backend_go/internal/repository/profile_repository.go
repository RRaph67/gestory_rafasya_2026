package repository

import (
    "gestory-backend/internal/models"

    "github.com/google/uuid"
    "gorm.io/gorm"
)

type ProfileRepository interface {
    FindByID(id uuid.UUID) (*models.Profile, error)
    Create(profile *models.Profile) error
    Update(profile *models.Profile) error
}

type profileRepository struct {
    db *gorm.DB
}

func NewProfileRepository(db *gorm.DB) ProfileRepository {
    return &profileRepository{db: db}
}

func (r *profileRepository) FindByID(id uuid.UUID) (*models.Profile, error) {
    var p models.Profile
    err := r.db.Where("id = ?", id).First(&p).Error
    if err != nil {
        if err == gorm.ErrRecordNotFound {
            return nil, nil
        }
        return nil, err
    }
    return &p, nil
}

func (r *profileRepository) Create(profile *models.Profile) error {
    return r.db.Create(profile).Error
}

func (r *profileRepository) Update(profile *models.Profile) error {
    return r.db.Save(profile).Error
}
