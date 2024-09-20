package system

import (
	"os"
	"path/filepath"
	"strings"

	"github.com/ipoluianov/gomisc/logger"
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

	cardHtml := `
	
		<div class="card_unit ani">
			<a href="%URL%" class="card_unit_link">
				<div class="card_content">
					<div class="card_content_img"><img class="card_content_image" src="%IMG_SRC%"/></div>
					<div class="card_content_text">%TEXT%</div>
				</div>
			</a>
		</div>
	
	
	`

	folders, _ := findPageTxt("pages")
	page.ViewHtml += `<div style="display: block;"> <div class="card_container">`
	for _, folder := range folders {
		name := strings.ReplaceAll(folder, "pages/", "") // POSIX
		name = strings.ReplaceAll(name, "pages\\", "")   // Win
		p, _ := pages.Get(name)

		imgUrl := "/public/simple.png"

		if IsFileExists(logger.CurrentExePath() + "/pages/" + name + "/image.png") {
			imgUrl = "/pages/" + name + "/image.png"
			logger.Println("IMAGE FOUND")
		}

		imgUrl = strings.ReplaceAll(imgUrl, "\\", "/")

		//page.ViewHtml += `<div><li><a href="/` + name + `">` + name + `</a> ` + p.Title + `</li></div>`
		itemHtml := cardHtml
		itemHtml = strings.ReplaceAll(itemHtml, "%URL%", name)
		itemHtml = strings.ReplaceAll(itemHtml, "%IMG_SRC%", imgUrl)
		itemHtml = strings.ReplaceAll(itemHtml, "%TEXT%", p.Title)
		itemHtml = strings.ReplaceAll(itemHtml, "%DESCRIPTION%", "")
		page.ViewHtml += itemHtml
	}

	page.Title = "Real-Time Data View"
	page.ViewHtml += `</div></div>`
	page.ContentText = `Index page`
	return
}

func IsFileExists(file string) bool {
	file = strings.ReplaceAll(file, "\\", "/")
	logger.Println("IsFileExists", file)
	info, err := os.Stat(file)
	if err != nil {
		return false
	}
	return !info.IsDir()
}
