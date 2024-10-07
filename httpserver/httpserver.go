package httpserver

import (
	"crypto/tls"
	_ "embed"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/ipoluianov/gomisc/logger"
	"github.com/ipoluianov/u00/data"
	"github.com/ipoluianov/u00/static"
	"github.com/ipoluianov/u00/system"
	"github.com/ipoluianov/u00/utils"
)

type HttpServer struct {
	srv    *http.Server
	srvTLS *http.Server

	s *system.System
}

func NewHttpServer() *HttpServer {
	var c HttpServer
	c.s = system.NewSystem()
	return &c
}

func (c *HttpServer) Start() {
	c.s.Start()

	go c.thListen()
	go c.thListenTLS()
}

func (c *HttpServer) portHttp() string {
	if utils.IsRoot() {
		return ":80"
	}
	return ":8080"
}

func (c *HttpServer) portHttps() string {
	if utils.IsRoot() {
		return ":443"
	}
	return ":8443"
}

func (c *HttpServer) thListen() {
	c.srv = &http.Server{
		Addr: c.portHttp(),
	}

	c.srv.Handler = c

	logger.Println("HttpServer thListen begin")
	err := c.srv.ListenAndServe()
	if err != nil {
		logger.Println("HttpServer thListen error: ", err)
	}
	logger.Println("HttpServer thListen end")
}

func (c *HttpServer) thListenTLS() {
	logger.Println("HttpServer::thListenTLS begin")
	tlsConfig := &tls.Config{}
	tlsConfig.Certificates = make([]tls.Certificate, 0)
	pathToBundle := logger.CurrentExePath() + "/bundle.crt"
	pathToPrivate := logger.CurrentExePath() + "/private.key"
	logger.Println("HttpServer::thListenTLS bundle.crt path:", pathToBundle)
	logger.Println("HttpServer::thListenTLS private.key path:", pathToPrivate)
	logger.Println("HttpServer::thListenTLS loading certificates ...")
	cert, err := tls.LoadX509KeyPair(pathToBundle, pathToPrivate)
	if err == nil {
		logger.Println("HttpServer::thListenTLS certificates is loaded SUCCESS")
		tlsConfig.Certificates = append(tlsConfig.Certificates, cert)
	} else {
		logger.Println("HttpServer::thListenTLS loading certificates ERROR", err)
		return
	}

	serverAddress := c.portHttps()
	c.srvTLS = &http.Server{
		Addr:      serverAddress,
		TLSConfig: tlsConfig,
	}
	c.srvTLS.Handler = c

	logger.Println("HttpServer::thListenTLS starting server at", serverAddress)
	listener, err := tls.Listen("tcp", serverAddress, tlsConfig)
	if err != nil {
		logger.Println("HttpServer::thListenTLS starting server ERROR", err)
		return
	}

	logger.Println("HttpServer::thListenTLS starting server SUCCESS")
	err = c.srvTLS.Serve(listener)
	if err != nil {
		logger.Println("HttpServerTLS thListen error: ", err)
		return
	}
	logger.Println("HttpServer::thListenTLS end")
}

func (c *HttpServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.TLS == nil {
		logger.Println("ProcessHTTP host: ", r.Host)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Request-Method", "GET")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			return
		}
		redirectUrl := ""
		if utils.IsRoot() {
			host := strings.ReplaceAll(r.Host, c.portHttp(), "")
			redirectUrl = "https://" + host + r.RequestURI

		} else {
			host := strings.ReplaceAll(r.Host, c.portHttp(), "")
			redirectUrl = "https://" + host + c.portHttps() + r.RequestURI
		}
		logger.Println("Redirect to HTTPS:", redirectUrl)
		http.Redirect(w, r, redirectUrl, http.StatusMovedPermanently)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Request-Method", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		return
	}

	parts := strings.FieldsFunc(r.RequestURI, func(r rune) bool {
		return r == '/'
	})

	logger.Println("URI:", r.RequestURI)

	path := "index"

	if len(parts) > 0 {
		path = parts[0]
	}

	if path == "public" {
		c.processFile(w, r)
		return
	}

	if path == "pages" {
		c.processFile(w, r)
		return
	}

	if path == "data" {
		if len(parts) > 1 {
			bs := data.DATA.Get(parts[1])
			w.Write([]byte(bs))
		}
		return
	}

	if path == "favicon.ico" {
		w.Header().Set("Content-Type", "image/x-icon")
		w.Write(static.Favicon_ico)
		return
	}

	pagePath := ""
	for p := range parts {
		pagePath += parts[p] + "/"
	}

	if len(pagePath) == 0 {
		pagePath = "index"
	}

	page, err := c.s.GetPage(pagePath)
	if err != nil {
		w.WriteHeader(404)
		w.Write([]byte("not found"))
		return
	}

	tmp := string(static.Main_html)
	tmp = strings.ReplaceAll(tmp, "%TITLE%", page.Title+" - Full Screen - Live Update")
	tmp = strings.ReplaceAll(tmp, "%PAGE_HEADER%", page.Title)
	tmp = strings.ReplaceAll(tmp, "%DESCRIPTION%", page.Description+" - watch in full screen.")
	tmp = strings.ReplaceAll(tmp, "%KEYWORDS%", page.KeyWords+", fullscreen, full, screen")

	//tmp = strings.ReplaceAll(tmp, "%VIEW_HTML%", string(page.ViewHtml))
	//tmp = strings.ReplaceAll(tmp, "%VIEW_SCRIPT%", string(page.ViewScript))
	tmp = strings.ReplaceAll(tmp, "%PAGE_SCRIPT%", string(page.PageScript))

	tmp = strings.ReplaceAll(tmp, "%CONTENT_TEXT%", string(page.ContentText))
	tmp = strings.ReplaceAll(tmp, "%BOTTOM_TEXT%", string(page.BottomText))

	w.Write([]byte(tmp))
}

func (c *HttpServer) processFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Request-Method", "GET")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		return
	}

	c.file(w, r, r.URL.Path)
}

func (c *HttpServer) file(w http.ResponseWriter, r *http.Request, urlPath string) {
	var err error
	var fileContent []byte
	var writtenBytes int

	realIP := getRealAddr(r)

	logger.Println("Real IP: ", realIP)
	logger.Println("HttpServer processFile: ", r.URL.String())

	var urlUnescaped string
	urlUnescaped, err = url.QueryUnescape(urlPath)
	if err == nil {
		urlPath = urlUnescaped
	}

	if urlPath == "/" || urlPath == "" {
		urlPath = "/index.html"
	}

	url, err := c.fullpath(urlPath, r.Host)

	//logger.Println("FullPath: " + url)

	if strings.Contains(url, "..") {
		logger.Println("Wrong FullPath")
		w.WriteHeader(404)
		return
	}

	if err != nil {
		w.WriteHeader(404)
		return
	}

	fileContent, err = os.ReadFile(url)

	if err == nil {
		w.Header().Set("Content-Type", c.contentTypeByExt(filepath.Ext(url)))
		writtenBytes, err = w.Write(fileContent)
		if err != nil {
			logger.Println("HttpServer sendError w.Write error:", err)
		}
		if writtenBytes != len(fileContent) {
			logger.Println("HttpServer sendError w.Write data size mismatch. (", writtenBytes, " / ", len(fileContent))
		}
	} else {
		logger.Println("HttpServer processFile error: ", err)
		w.WriteHeader(404)
	}
}

func (c *HttpServer) contentTypeByExt(ext string) string {
	var builtinTypesLower = map[string]string{
		".css":  "text/css; charset=utf-8",
		".gif":  "image/gif",
		".htm":  "text/html; charset=utf-8",
		".html": "text/html; charset=utf-8",
		".jpeg": "image/jpeg",
		".jpg":  "image/jpeg",
		".js":   "text/javascript; charset=utf-8",
		".mjs":  "text/javascript; charset=utf-8",
		".pdf":  "application/pdf",
		".png":  "image/png",
		".svg":  "image/svg+xml",
		".wasm": "application/wasm",
		".webp": "image/webp",
		".xml":  "text/xml; charset=utf-8",
	}

	logger.Println("Ext: ", ext)

	if ct, ok := builtinTypesLower[ext]; ok {
		return ct
	}
	return "text/plain"
}

func (c *HttpServer) fullpath(url string, _ string) (string, error) {
	result := ""
	result = logger.CurrentExePath() + "/" + url
	fi, err := os.Stat(result)
	if err == nil {
		if fi.IsDir() {
			result += "/index.html"
		}
	}
	return result, err
}

func getRealAddr(r *http.Request) string {

	remoteIP := ""
	// the default is the originating ip. but we try to find better options because this is almost
	// never the right IP
	if parts := strings.Split(r.RemoteAddr, ":"); len(parts) == 2 {
		remoteIP = parts[0]
	}
	// If we have a forwarded-for header, take the address from there
	if xff := strings.Trim(r.Header.Get("X-Forwarded-For"), ","); len(xff) > 0 {
		addrs := strings.Split(xff, ",")
		lastFwd := addrs[len(addrs)-1]
		if ip := net.ParseIP(lastFwd); ip != nil {
			remoteIP = ip.String()
		}
		// parse X-Real-Ip header
	} else if xri := r.Header.Get("X-Real-Ip"); len(xri) > 0 {
		if ip := net.ParseIP(xri); ip != nil {
			remoteIP = ip.String()
		}
	}

	return remoteIP

}
