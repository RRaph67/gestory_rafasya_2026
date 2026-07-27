package dto

import "time"

type SubmitGameScoreRequest struct {
	PlayerName        string  `json:"playerName" binding:"required"`
	FinalScore        int     `json:"finalScore"`
	QuestionsAnswered int     `json:"questionsAnswered"`
	CorrectAnswers    int     `json:"correctAnswers"`
	Accuracy          float64 `json:"accuracy"`
	TimeSpent         int     `json:"timeSpent"`
}

type SubmitGameScoreResponse struct {
	ID         string    `json:"id"`
	PlayerName string    `json:"playerName"`
	FinalScore int       `json:"finalScore"`
	CreatedAt  time.Time `json:"createdAt"`
}

type LeaderboardItem struct {
	Rank       int       `json:"rank"`
	Score      int       `json:"score"`
	PlayerName string    `json:"playerName"`
	Date       time.Time `json:"date"`
}
