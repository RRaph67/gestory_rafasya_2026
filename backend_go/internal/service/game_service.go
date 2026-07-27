package service

import (
	"gestory-backend/internal/dto"
	"gestory-backend/internal/models"
	"gestory-backend/internal/repository"
	"time"
)

type GameService interface {
	SubmitScore(req dto.SubmitGameScoreRequest) (*dto.SubmitGameScoreResponse, error)
	GetLeaderboard(limit int) ([]dto.LeaderboardItem, error)
}

type gameService struct {
	gameRepo repository.GameRepository
}

func NewGameService(gameRepo repository.GameRepository) GameService {
	return &gameService{gameRepo: gameRepo}
}

func (s *gameService) SubmitScore(req dto.SubmitGameScoreRequest) (*dto.SubmitGameScoreResponse, error) {
	scoreModel := models.GameScore{
		PlayerName:        req.PlayerName,
		Score:             req.FinalScore,
		QuestionsAnswered: req.QuestionsAnswered,
		CorrectAnswers:    req.CorrectAnswers,
		Accuracy:          req.Accuracy,
		TimeSpent:         req.TimeSpent,
		CompletedAt:       time.Now(),
	}

	err := s.gameRepo.Create(&scoreModel)
	if err != nil {
		return nil, err
	}

	return &dto.SubmitGameScoreResponse{
		ID:         scoreModel.ID.String(),
		PlayerName: scoreModel.PlayerName,
		FinalScore: scoreModel.Score,
		CreatedAt:  scoreModel.CompletedAt,
	}, nil
}

func (s *gameService) GetLeaderboard(limit int) ([]dto.LeaderboardItem, error) {
	scores, err := s.gameRepo.GetTopScores(limit)
	if err != nil {
		return nil, err
	}

	items := make([]dto.LeaderboardItem, 0, len(scores))
	for i, score := range scores {
		items = append(items, dto.LeaderboardItem{
			Rank:       i + 1,
			Score:      score.Score,
			PlayerName: score.PlayerName,
			Date:       score.CompletedAt,
		})
	}

	return items, nil
}
