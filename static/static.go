package static

import (
	_ "embed"
)

//go:embed main.css
var Main_css []byte

//go:embed cards.css
var Cards_css []byte

//go:embed main.js
var Main_js []byte

//go:embed main.html
var Main_html []byte
