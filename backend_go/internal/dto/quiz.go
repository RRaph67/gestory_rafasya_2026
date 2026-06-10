package dto

type QuizQuestionItem struct {
	ID            string            `json:"id"`
	Question      string            `json:"question"`
	Options       map[string]string `json:"options"`
	CorrectAnswer string            `json:"correctAnswer"`
	Explanation   string            `json:"explanation"`
	Difficulty    string            `json:"difficulty,omitempty"`
}

type QuizQuestionsResponse struct {
	Questions []QuizQuestionItem `json:"questions"`
	Total     int                `json:"total"`
}

type SubmitQuizRequest struct {
	CourseID  string             `json:"courseId" binding:"required"`
	Answers   []SubmitQuizAnswer `json:"answers" binding:"required"`
	TimeSpent int                `json:"timeSpent"`
}

type SubmitQuizAnswer struct {
	QuestionID     string `json:"questionId" binding:"required"`
	SelectedAnswer string `json:"selectedAnswer" binding:"required"`
}

type SubmitQuizResult struct {
	QuestionID string `json:"questionId"`
	IsCorrect  bool   `json:"isCorrect"`
}

type SubmitQuizResponse struct {
	Score      int                `json:"score"`
	Total      int                `json:"total"`
	Percentage int                `json:"percentage"`
	Results    []SubmitQuizResult `json:"results"`
}
