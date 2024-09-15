package system

import (
	"errors"

	"github.com/ipoluianov/u00/static"
)

func (c *System) GetPage(path string) (page Page, err error) {
	if path == "index" {
		return c.GetPageIndex()
	}
	if path == "time" {
		return c.GetPageTime()
	}
	err = errors.New(`page not found`)
	return
}

func (c *System) GetPageIndex() (page Page, err error) {
	page.HTML = []byte(`
	<a href="/time">Time</a>`)
	return
}

func (c *System) GetPageTime() (page Page, err error) {
	page.Title = "Time"
	page.Description = "Current Time"
	page.ContentText = `
If you started counting each current moment 
as a unique "now" (like saying "now" every second), you'd never be
able to return to the "now" that has already passed! Each "now" 
is completely unique and unrepeatable, so you're
literally living in one of the most unique moments 
in the universe every single second!
`
	page.BottomText = "SHOW ME THE WORLD"
	page.HTML = static.View_simple_text_html
	page.JS = static.View_simple_text_script_js
	return
}
