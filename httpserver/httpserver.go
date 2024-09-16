package httpserver

import (
	"crypto/tls"
	_ "embed"
	"net/http"
	"strings"

	"github.com/ipoluianov/gomisc/logger"
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

	if path == "data" {
		if len(parts) > 1 {
			bs := c.s.Get(parts[1])
			w.Write([]byte(bs))
		}
		return
	}

	if path == "main.css" {
		w.Header().Set("Content-Type", "text/css")
		w.Write(static.Main_css)
		return
	}

	if path == "main.js" {
		w.Header().Set("Content-Type", "application/javascript")
		w.Write(static.Main_js)
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

	tmp = strings.ReplaceAll(tmp, "%VIEW_HTML%", string(page.ViewHtml))
	tmp = strings.ReplaceAll(tmp, "%VIEW_SCRIPT%", string(page.ViewScript))
	tmp = strings.ReplaceAll(tmp, "%PAGE_SCRIPT%", string(page.PageScript))

	tmp = strings.ReplaceAll(tmp, "%CONTENT_TEXT%", string(page.ContentText))
	tmp = strings.ReplaceAll(tmp, "%BOTTOM_TEXT%", string(page.BottomText))

	w.Write([]byte(tmp))
}
