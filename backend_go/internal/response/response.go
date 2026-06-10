package response

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ErrorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func Success(c *gin.Context, status int, data any, message string) {
	c.JSON(status, gin.H{
		"success":   true,
		"data":      data,
		"message":   message,
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func Error(c *gin.Context, status int, code string, message string) {
	c.JSON(status, gin.H{
		"success": false,
		"error": ErrorBody{
			Code:    code,
			Message: message,
		},
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

func BadRequest(c *gin.Context, message string) {
	Error(c, http.StatusBadRequest, "BAD_REQUEST", message)
}

func NotFound(c *gin.Context, code string, message string) {
	Error(c, http.StatusNotFound, code, message)
}

func Internal(c *gin.Context) {
	Error(c, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", "Terjadi kesalahan pada server")
}
