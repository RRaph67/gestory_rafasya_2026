package service

import (
	"encoding/json"

	"gestory-backend/internal/dto"
	"gestory-backend/internal/models"
	"gestory-backend/internal/repository"
)

type CourseService interface {
	GetCourses() (*dto.CourseListResponse, error)
	GetCourseBySlug(slug string) (*dto.CourseDetailResponse, error)
	GetMaterialsBySlug(slug string) ([]dto.MaterialSection, error)
	GetQuestionsBySlug(slug string) (*dto.QuizQuestionsResponse, error)
}

type courseService struct {
	courseRepo repository.CourseRepository
}

func NewCourseService(courseRepo repository.CourseRepository) CourseService {
	return &courseService{courseRepo: courseRepo}
}

func (s *courseService) GetCourses() (*dto.CourseListResponse, error) {
	courses, err := s.courseRepo.FindAll()
	if err != nil {
		return nil, err
	}

	items := make([]dto.CourseListItem, 0, len(courses))
	for _, course := range courses {
		items = append(items, dto.CourseListItem{
			ID:          course.Slug,
			Title:       course.Title,
			Description: course.Description,
			Image:       course.ImageURL,
		})
	}

	return &dto.CourseListResponse{
		Courses: items,
		Total:   len(items),
	}, nil
}

func (s *courseService) GetCourseBySlug(slug string) (*dto.CourseDetailResponse, error) {
	course, err := s.courseRepo.FindBySlug(slug)
	if err != nil || course == nil {
		return nil, err
	}

	return &dto.CourseDetailResponse{
		Course: mapCourseDetail(*course),
	}, nil
}

func (s *courseService) GetMaterialsBySlug(slug string) ([]dto.MaterialSection, error) {
	materials, err := s.courseRepo.FindMaterialsBySlug(slug)
	if err != nil {
		return nil, err
	}

	sections := make([]dto.MaterialSection, 0, len(materials))
	for _, material := range materials {
		sections = append(sections, mapMaterial(material))
	}
	return sections, nil
}

func (s *courseService) GetQuestionsBySlug(slug string) (*dto.QuizQuestionsResponse, error) {
	questions, err := s.courseRepo.FindQuestionsBySlug(slug)
	if err != nil {
		return nil, err
	}

	items := make([]dto.QuizQuestionItem, 0, len(questions))
	for _, question := range questions {
		items = append(items, mapQuizQuestion(question))
	}

	return &dto.QuizQuestionsResponse{
		Questions: items,
		Total:     len(items),
	}, nil
}

func mapCourseDetail(course models.Course) dto.CourseDetail {
	sections := make([]dto.MaterialSection, 0, len(course.Materials))
	for _, material := range course.Materials {
		sections = append(sections, mapMaterial(material))
	}

	questions := make([]dto.QuizQuestionItem, 0, len(course.QuizQuestions))
	for _, question := range course.QuizQuestions {
		questions = append(questions, mapQuizQuestion(question))
	}

	return dto.CourseDetail{
		ID:          course.Slug,
		Title:       course.Title,
		Breadcrumb:  course.Title,
		Description: course.Description,
		Image:       course.ImageURL,
		Sections:    sections,
		Questions:   questions,
	}
}

func mapMaterial(material models.Material) dto.MaterialSection {
	return dto.MaterialSection{
		Type:    material.Type,
		Title:   material.Title,
		Content: material.Content,
		URL:     material.URL,
	}
}

func mapQuizQuestion(question models.QuizQuestion) dto.QuizQuestionItem {
	options := map[string]string{}
	if len(question.Options) > 0 {
		_ = json.Unmarshal(question.Options, &options)
	}

	return dto.QuizQuestionItem{
		ID:            question.ID.String(),
		Question:      question.Question,
		Options:       options,
		CorrectAnswer: question.CorrectAnswer,
		Explanation:   question.Explanation,
		Difficulty:    question.Difficulty,
	}
}
