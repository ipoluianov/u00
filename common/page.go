package common

type Page struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	KeyWords    string `json:"keywords"`
	ContentText string `json:"content_text"`
	BottomText  string `json:"bottom_text"`
	PageScript  string `json:"page_script"`
}
