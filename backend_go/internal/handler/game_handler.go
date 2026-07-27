package handler

import (
	"net/http"
	"strconv"

	"gestory-backend/internal/dto"
	"gestory-backend/internal/response"
	"gestory-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type GameHandler struct {
	courseService service.CourseService
	gameService   service.GameService
}

func NewGameHandler(courseService service.CourseService, gameService service.GameService) *GameHandler {
	return &GameHandler{
		courseService: courseService,
		gameService:   gameService,
	}
}

func (h *GameHandler) GetQuestions(c *gin.Context) {
	slug := c.DefaultQuery("courseId", "bab-1")
	data, err := h.courseService.GetQuestionsBySlug(slug)
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Game questions retrieved successfully")
}

func (h *GameHandler) SubmitScore(c *gin.Context) {
	var request dto.SubmitGameScoreRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		response.BadRequest(c, "Payload submit skor game tidak valid")
		return
	}

	data, err := h.gameService.SubmitScore(request)
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Game score submitted successfully")
}

func (h *GameHandler) GetLeaderboard(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	data, err := h.gameService.GetLeaderboard(limit)
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Leaderboard retrieved successfully")
}

