package dto

type CourseListItem struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Image       string `json:"image"`
	Status      string `json:"status,omitempty"`
}

type CourseListResponse struct {
	Courses []CourseListItem `json:"courses"`
	Total   int              `json:"total"`
}

type CourseDetailResponse struct {
	Course CourseDetail `json:"course"`
}

type CourseDetail struct {
	ID          string             `json:"id"`
	Title       string             `json:"title"`
	Breadcrumb  string             `json:"breadcrumb"`
	Description string             `json:"description"`
	Image       string             `json:"image"`
	Status      string             `json:"status,omitempty"`
	Sections    []MaterialSection  `json:"sections"`
	Questions   []QuizQuestionItem `json:"questions"`
}

type MaterialSection struct {
	Type    string `json:"type"`
	Title   string `json:"title"`
	Content string `json:"content,omitempty"`
	URL     string `json:"url,omitempty"`
}
