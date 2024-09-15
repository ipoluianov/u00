package system

import "sync"

type System struct {
	mtx  sync.Mutex
	data map[string]string
}

func NewSystem() *System {
	var c System
	c.data = make(map[string]string)
	return &c
}

func (c *System) Start() {
	go c.ThUpdateData()
}

func (c *System) Stop() {
}

func (c *System) Get(key string) string {
	c.mtx.Lock()
	defer c.mtx.Unlock()
	return c.data[key]
}

func (c *System) Set(key, value string) {
	c.mtx.Lock()
	defer c.mtx.Unlock()
	c.data[key] = value
}
