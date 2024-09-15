package system

import (
	"github.com/ipoluianov/u00/common"
	"github.com/ipoluianov/u00/pages"
)

func (c *System) GetPage(path string) (page common.Page, err error) {
	if path == "index" {
		return c.GetPageIndex()
	}
	return pages.Get(path)
}

func (c *System) GetPageIndex() (page common.Page, err error) {
	page.ViewHtml = `<a href="/time">Time</a>`
	return
}
