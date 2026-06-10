package repository

import (
	"errors"

	"gestory-backend/internal/models"

	"gorm.io/gorm"
)

type CourseRepository interface {
	FindAll() ([]models.Course, error)
	FindBySlug(slug string) (*models.Course, error)
	FindMaterialsBySlug(slug string) ([]models.Material, error)
	FindQuestionsBySlug(slug string) ([]models.QuizQuestion, error)
}

type courseRepository struct {
	db *gorm.DB
}

func NewCourseRepository(db *gorm.DB) CourseRepository {
	return &courseRepository{db: db}
}

func (r *courseRepository) FindAll() ([]models.Course, error) {
	var courses []models.Course
	err := r.db.Order("title ASC").Find(&courses).Error
	return courses, err
}

func (r *courseRepository) FindBySlug(slug string) (*models.Course, error) {
	var course models.Course
	err := r.db.
		Preload("Materials", func(db *gorm.DB) *gorm.DB {
			return db.Order("order_index ASC")
		}).
		Preload("QuizQuestions").
		Where("slug = ?", slug).
		First(&course).
		Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &course, nil
}

func (r *courseRepository) FindMaterialsBySlug(slug string) ([]models.Material, error) {
	var materials []models.Material
	err := r.db.
		Joins("JOIN courses ON courses.id = materials.course_id").
		Where("courses.slug = ?", slug).
		Order("materials.order_index ASC").
		Find(&materials).
		Error
	return materials, err
}

func (r *courseRepository) FindQuestionsBySlug(slug string) ([]models.QuizQuestion, error) {
	var questions []models.QuizQuestion
	err := r.db.
		Joins("JOIN courses ON courses.id = quiz_questions.course_id").
		Where("courses.slug = ?", slug).
		Find(&questions).
		Error
	return questions, err
}
