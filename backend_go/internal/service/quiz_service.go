package service

import (
	"math"

	"gestory-backend/internal/dto"
	"gestory-backend/internal/repository"
)

type QuizService interface {
	SubmitQuiz(request dto.SubmitQuizRequest) (*dto.SubmitQuizResponse, error)
}

type quizService struct {
	courseRepo repository.CourseRepository
	quizRepo   repository.QuizRepository
}

func NewQuizService(courseRepo repository.CourseRepository, quizRepo repository.QuizRepository) QuizService {
	return &quizService{
		courseRepo: courseRepo,
		quizRepo:   quizRepo,
	}
}

func (s *quizService) SubmitQuiz(request dto.SubmitQuizRequest) (*dto.SubmitQuizResponse, error) {
	questions, err := s.courseRepo.FindQuestionsBySlug(request.CourseID)
	if err != nil {
		return nil, err
	}

	correctAnswers := map[string]string{}
	for _, question := range questions {
		correctAnswers[question.ID.String()] = question.CorrectAnswer
	}

	score := 0
	results := make([]dto.SubmitQuizResult, 0, len(request.Answers))
	for _, answer := range request.Answers {
		isCorrect := correctAnswers[answer.QuestionID] == answer.SelectedAnswer
		if isCorrect {
			score += 100
		}
		results = append(results, dto.SubmitQuizResult{
			QuestionID: answer.QuestionID,
			IsCorrect:  isCorrect,
		})
	}

	total := len(questions)
	percentage := 0
	if total > 0 {
		percentage = int(math.Round(float64(score) / float64(total*100) * 100))
	}

	return &dto.SubmitQuizResponse{
		Score:      score,
		Total:      total,
		Percentage: percentage,
		Results:    results,
	}, nil
}
