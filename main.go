package main

import (
	"github.com/ipoluianov/gomisc/logger"
	"github.com/ipoluianov/u00/app"
	"github.com/ipoluianov/u00/application"
)

func main() {
	name := "u00"
	application.Name = name
	application.ServiceName = name
	application.ServiceDisplayName = name
	application.ServiceDescription = name
	application.ServiceRunFunc = app.RunAsService
	application.ServiceStopFunc = app.StopService
	logger.Init(logger.CurrentExePath() + "/logs")

	if !application.TryService() {
		app.RunDesktop()
	}

}
