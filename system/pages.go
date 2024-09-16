package system

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/ipoluianov/u00/common"
	"github.com/ipoluianov/u00/pages"
)

func (c *System) GetPage(path string) (page common.Page, err error) {
	if path == "index" {
		return c.GetPageIndex()
	}
	return pages.Get(path)
}

func findPageTxt(root string) ([]string, error) {
	var directories []string

	// функция обратного вызова для filepath.Walk
	err := filepath.Walk(root, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// проверяем, является ли найденный файл page.txt
		if info.IsDir() {
			return nil
		}
		if info.Name() == "page.txt" {
			// добавляем директорию, в которой найден файл
			dir := filepath.Dir(path)
			directories = append(directories, dir)
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return directories, nil
}

func (c *System) GetPageIndex() (page common.Page, err error) {
	folders, _ := findPageTxt("pages")
	page.ViewHtml += `<div style="display: block;">`
	for _, folder := range folders {
		name := strings.ReplaceAll(folder, "pages/", "") // POSIX
		name = strings.ReplaceAll(name, "pages\\", "")   // Win
		p, _ := pages.Get(name)
		page.ViewHtml += `<div><li><a href="/` + name + `">` + name + `</a> ` + p.Title + `</li></div>`
	}
	page.Title = "Real-Time Data View"
	page.ViewHtml += `</div>`
	page.ContentText = `Index page`
	return
}
