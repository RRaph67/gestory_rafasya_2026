package routes

import (
	"strings"
	"time"

	"gestory-backend/internal/config"
	"gestory-backend/internal/handler"
	"gestory-backend/internal/repository"
	"gestory-backend/internal/service"
	"gestory-backend/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func NewRouter(cfg config.Config, db *gorm.DB) *gin.Engine {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Support comma-separated list of allowed origins (e.g. localhost + Vercel URL)
	allowedOrigins := strings.Split(cfg.FrontendURL, ",")
	for i, o := range allowedOrigins {
		allowedOrigins[i] = strings.TrimSpace(o)
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	courseRepo := repository.NewCourseRepository(db)
	quizRepo := repository.NewQuizRepository(db)
	gameRepo := repository.NewGameRepository(db)
	profileRepo := repository.NewProfileRepository(db)

	courseService := service.NewCourseService(courseRepo)
	quizService := service.NewQuizService(courseRepo, quizRepo)
	gameService := service.NewGameService(gameRepo)
	profileService := service.NewProfileService(profileRepo)

	healthHandler := handler.NewHealthHandler()
	courseHandler := handler.NewCourseHandler(courseService)
	quizHandler := handler.NewQuizHandler(courseService, quizService)
	gameHandler := handler.NewGameHandler(courseService, gameService)
	profileHandler := handler.NewProfileHandler(profileService)

	api := router.Group("/api/v1")
	{
		api.GET("/health", healthHandler.Check)

		api.GET("/courses", courseHandler.GetCourses)
		api.GET("/courses/:slug", courseHandler.GetCourseBySlug)
		api.GET("/courses/:slug/materials", courseHandler.GetMaterialsBySlug)
		api.GET("/courses/:slug/questions", courseHandler.GetQuestionsBySlug)

		api.GET("/quiz/:slug/questions", quizHandler.GetQuestions)
		api.POST("/quiz/submit", middleware.SupabaseAuth(cfg.SupabaseJWTSecret, cfg.SupabaseJWKSURL), quizHandler.Submit)

		api.GET("/game/questions", gameHandler.GetQuestions)
		api.POST("/game/submit", middleware.SupabaseAuth(cfg.SupabaseJWTSecret, cfg.SupabaseJWKSURL), gameHandler.SubmitScore)
		api.GET("/game/leaderboard", gameHandler.GetLeaderboard)
		api.GET("/me", middleware.SupabaseAuth(cfg.SupabaseJWTSecret, cfg.SupabaseJWKSURL), profileHandler.Me)
	}

	return router
}
