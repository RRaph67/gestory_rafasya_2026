package service

import (
    "gestory-backend/internal/models"
    "gestory-backend/internal/repository"
    "github.com/google/uuid"
)

type ProfileService interface {
    GetOrCreateProfileByUserID(userID string) (*models.Profile, error)
}

type profileService struct {
    repo repository.ProfileRepository
}

func NewProfileService(repo repository.ProfileRepository) ProfileService {
    return &profileService{repo: repo}
}

func (s *profileService) GetOrCreateProfileByUserID(userID string) (*models.Profile, error) {
    id, err := uuid.Parse(userID)
    if err != nil {
        return nil, err
    }

    p, err := s.repo.FindByID(id)
    if err != nil {
        return nil, err
    }
    if p != nil {
        return p, nil
    }

    // Create minimal profile
    newP := &models.Profile{
        ID:       id,
        FullName: "",
        AvatarURL: "",
        IsAdmin:  false,
    }
    if err := s.repo.Create(newP); err != nil {
        return nil, err
    }
    return newP, nil
}
