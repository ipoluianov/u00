package static

import (
	_ "embed"
)

//go:embed main.css
var Main_css []byte

//go:embed main.js
var Main_js []byte

//go:embed main.html
var Main_html []byte

//go:embed view_simple_text_script.html
var View_simple_text_script_js []byte

//go:embed view_simple_text.html
var View_simple_text_html []byte
