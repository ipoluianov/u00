package system

import "errors"

func (c *System) GetPage(path string) (result []byte, err error) {
	if path == "index" {
		return c.GetPageIndex()
	}
	if path == "time" {
		return c.GetPageTime()
	}
	err = errors.New(`page not found`)
	return
}

func (c *System) GetPageIndex() (result []byte, err error) {
	result = []byte(`
	<a href="/time">Time</a>`)
	return
}

func (c *System) GetPageTime() (result []byte, err error) {
	result = []byte("TIME")
	return
}
