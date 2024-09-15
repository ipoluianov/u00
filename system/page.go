package system

type Page struct {
	Title       string
	Description string
	KeyWords    string
	ContentText string
	BottomText  string
	HTML        []byte
	JS          []byte
}
