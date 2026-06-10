package handler

import (
	"net/http"

	"gestory-backend/internal/response"

	"github.com/gin-gonic/gin"
)

type HealthHandler struct{}

func NewHealthHandler() *HealthHandler {
	return &HealthHandler{}
}

func (h *HealthHandler) Check(c *gin.Context) {
	response.Success(c, http.StatusOK, gin.H{"status": "ok"}, "Gestory API is healthy")
}
