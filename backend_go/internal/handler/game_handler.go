package handler

import (
	"net/http"

	"gestory-backend/internal/response"
	"gestory-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type GameHandler struct {
	courseService service.CourseService
}

func NewGameHandler(courseService service.CourseService) *GameHandler {
	return &GameHandler{courseService: courseService}
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
