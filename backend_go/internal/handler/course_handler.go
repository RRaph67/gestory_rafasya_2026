package handler

import (
	"net/http"

	"gestory-backend/internal/response"
	"gestory-backend/internal/service"

	"github.com/gin-gonic/gin"
)

type CourseHandler struct {
	courseService service.CourseService
}

func NewCourseHandler(courseService service.CourseService) *CourseHandler {
	return &CourseHandler{courseService: courseService}
}

func (h *CourseHandler) GetCourses(c *gin.Context) {
	data, err := h.courseService.GetCourses()
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Courses retrieved successfully")
}

func (h *CourseHandler) GetCourseBySlug(c *gin.Context) {
	slug := c.Param("slug")
	data, err := h.courseService.GetCourseBySlug(slug)
	if err != nil {
		response.Internal(c)
		return
	}
	if data == nil {
		response.NotFound(c, "COURSE_NOT_FOUND", "Course tidak ditemukan")
		return
	}

	response.Success(c, http.StatusOK, data, "Course detail retrieved successfully")
}

func (h *CourseHandler) GetMaterialsBySlug(c *gin.Context) {
	slug := c.Param("slug")
	data, err := h.courseService.GetMaterialsBySlug(slug)
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Materials retrieved successfully")
}

func (h *CourseHandler) GetQuestionsBySlug(c *gin.Context) {
	slug := c.Param("slug")
	data, err := h.courseService.GetQuestionsBySlug(slug)
	if err != nil {
		response.Internal(c)
		return
	}

	response.Success(c, http.StatusOK, data, "Questions retrieved successfully")
}
