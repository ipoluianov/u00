package system

import "github.com/ipoluianov/u00/blockchain/eth"

type System struct {
	eth *eth.Eth
}

func NewSystem() *System {
	var c System
	c.eth = eth.NewEth()
	return &c
}

func (c *System) Start() {
	c.eth.Start()
}

func (c *System) Stop() {
	c.eth.Stop()
}
