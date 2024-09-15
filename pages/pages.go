package pages

import (
	"errors"
	"os"
	"strings"

	"github.com/ipoluianov/gomisc/logger"
	"github.com/ipoluianov/u00/common"
	"github.com/ipoluianov/u00/views"
)

func readPageFile(code string) (map[string]string, error) {
	result := make(map[string]string)
	path := logger.CurrentExePath()
	bs, err := os.ReadFile(path + "/pages/" + code + "/page.txt")
	if err != nil {
		return result, err
	}
	lines := strings.Split(string(bs), "\n")
	for _, line := range lines {
		index := strings.Index(line, ":")
		if index == -1 {
			continue
		}
		name := line[:index]
		value := line[index+1:]
		name = strings.Trim(name, " \r\n\t")
		value = strings.Trim(value, " \r\n\t")
		result[name] = value
	}
	return result, nil
}

func read(code string, fileName string) (content string) {
	path := logger.CurrentExePath()
	bs, err := os.ReadFile(path + "/pages/" + code + "/" + fileName)
	if err != nil {
		return
	}
	content = string(bs)
	return
}

func IsDirectoryExists(code string) bool {
	path := logger.CurrentExePath()
	info, err := os.Stat(path + "/pages/" + code)
	if err != nil {
		return false
	}
	return info.IsDir()
}

func Get(code string) (page common.Page, err error) {
	if !IsDirectoryExists(code) {
		err = errors.New("page not found")
		return
	}

	pageMap, err := readPageFile(code)
	if err != nil {
		return
	}

	page.Title = pageMap["title"]
	page.Description = pageMap["description"]
	page.BottomText = pageMap["bottom_text"]
	page.KeyWords = pageMap["keywords"]
	page.ContentText = pageMap["content_text"]
	vCode := pageMap["view"]
	v := views.Get(vCode)
	page.ViewHtml = v.Html
	page.ViewScript = v.Script

	dataSource := pageMap["datasource"]
	page.PageScript = read(code, "script.html")
	if len(dataSource) > 0 {
		page.PageScript = `
<script>
    this.OnTick = function () {
        fetch('%DATASOURCE%')
            .then(response => response.text())
            .then(data => this.SetViewData(data));
    }
</script>
		`
		page.PageScript = strings.ReplaceAll(page.PageScript, "%DATASOURCE%", dataSource)
	}

	return
}
