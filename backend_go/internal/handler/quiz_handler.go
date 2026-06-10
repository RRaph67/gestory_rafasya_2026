package handler

import (
	"net/http"

	"gestory-backend/internal/dto"
	"gestory-backend/internal/response"
	"gestory-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type QuizHandler struct {
	courseService service.CourseService
	quizService   service.QuizService
}

func NewQuizHandler(courseService service.CourseService, quizService service.QuizService) *QuizHandler {
	return &QuizHandler{
		courseService: courseService,
		quizService:   quizService,
	}
}

func (h *QuizHandler) GetQuestions(c *gin.Context) {
	slug := c.Param("slug")
	data, err := h.courseService.GetQuestionsBySlug(slug)
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Quiz questions retrieved successfully")
}

func (h *QuizHandler) Submit(c *gin.Context) {
	var request dto.SubmitQuizRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.BadRequest(c, "Payload submit quiz tidak valid")
		return
	}

	data, err := h.quizService.SubmitQuiz(request)
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Quiz submitted successfully")
}
