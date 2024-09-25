package static

import (
	_ "embed"
)

//go:embed main.html
var Main_html []byte

//go:embed favicon.ico
var Favicon_ico []byte
