package routes

import (
	"time"

	"gestory-backend/internal/config"
	"gestory-backend/internal/handler"
	"gestory-backend/internal/repository"
	"gestory-backend/internal/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewRouter(cfg config.Config, db *gorm.DB) *gin.Engine {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{cfg.FrontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	courseRepo := repository.NewCourseRepository(db)
	quizRepo := repository.NewQuizRepository(db)

	courseService := service.NewCourseService(courseRepo)
	quizService := service.NewQuizService(courseRepo, quizRepo)

	healthHandler := handler.NewHealthHandler()
	courseHandler := handler.NewCourseHandler(courseService)
	quizHandler := handler.NewQuizHandler(courseService, quizService)
	gameHandler := handler.NewGameHandler(courseService)

	api := router.Group("/api/v1")
	{
		api.GET("/health", healthHandler.Check)

		api.GET("/courses", courseHandler.GetCourses)
		api.GET("/courses/:slug", courseHandler.GetCourseBySlug)
		api.GET("/courses/:slug/materials", courseHandler.GetMaterialsBySlug)
		api.GET("/courses/:slug/questions", courseHandler.GetQuestionsBySlug)

		api.GET("/quiz/:slug/questions", quizHandler.GetQuestions)
		api.POST("/quiz/submit", quizHandler.Submit)

		api.GET("/game/questions", gameHandler.GetQuestions)
	}

	return router
}
