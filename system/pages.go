package system

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/ipoluianov/gomisc/logger"
	"github.com/ipoluianov/u00/common"
	"github.com/ipoluianov/u00/pages"
)

func (c *System) GetPage(path string) (page common.Page, err error) {
	if path == "index" {
		return c.GetPageIndex()
	}

	p, err := pages.Get(path)
	if err != nil {
		return
	}

	pageScript := `
<div id="textParent" style="width: 100%; height: 100%;overflow: hidden;">
	<canvas id="APP_cnv" app-id="APP" class="widget" style="display: block; box-sizing: border-box;"></canvas>
</div>
<script>
	APP = {};		

	APP.id = "APP";
	APP.data = {};
	APP.tick = function() {};
	APP.draw = function(elId) {};

	APP_CODE

	window.fullScreenCanvas = APP_cnv;
</script>`

	appId := "app_" + fmt.Sprint(time.Now().UnixMicro())

	itemHtml := pageScript

	itemHtml = strings.ReplaceAll(itemHtml, "APP_CODE", p.TickScript)
	itemHtml = strings.ReplaceAll(itemHtml, "APP", ""+appId)

	p.PageScript = itemHtml

	return p, nil
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
					<div class="card_content_img">
		                <canvas id="APP_CNV" app-id="APP" class="widget" style="display: block; box-sizing: border-box; width:340px; height:190px;">
                		</canvas>
						<script>
							APP = {};

							APP.id = "APP";
							APP.data = {};
							APP.tick = function() {};
							APP.draw = function(elId) {};

							APP_CODE
						</script>
					</div>
					<div class="card_content_text">%TEXT%</div>
				</div>
			</a>
		</div>
	`

	folders, _ := findPageTxt("pages")
	page.PageScript += `<div style="display: block;"> <div class="card_container">`
	for folderIndex, folder := range folders {
		appId := "app_" + fmt.Sprint(time.Now().UnixMicro()) + "_" + fmt.Sprint(folderIndex)
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

		itemHtml = strings.ReplaceAll(itemHtml, "APP_CNV", appId+"_cnv")
		itemHtml = strings.ReplaceAll(itemHtml, "APP_CODE", p.TickScript)
		itemHtml = strings.ReplaceAll(itemHtml, "APP", appId)

		page.PageScript += itemHtml
	}

	page.Title = "Real-Time Data View"
	page.PageScript += `</div></div>`
	page.PageScript += `
	<div>Welcome to U00.IO<div>
A minimalist platform designed for real-time monitoring of key metrics. Each page is dedicated to displaying a single parameter in full screen, optimized for instant access and clear visibility. Whether it's the current time, live Bitcoin prices, or any other important data, our pages provide a seamless, distraction-free experience.
<br/>
Key Features:
<br/>

Full-Screen Display: Each metric is shown in full screen, making it perfect for large displays or quick glances on mobile devices.
<br/>

Live Updates: All data is updated in real-time, ensuring you're always up-to-date with the latest information.
<br/>

Simple Navigation: Easily switch between different metrics, or set your favorite pages as shortcuts for one-tap access.
<br/>

Stay informed at a glance with our clean, real-time monitoring pages. Perfect for both personal and professional use.`
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
