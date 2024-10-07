package data

import (
	"fmt"
	"sync"
	"time"
)

type Data struct {
	mtx  sync.Mutex
	data map[string]string
}

var DATA *Data

func init() {
	DATA = NewData()
}

func NewData() *Data {
	var c Data
	c.data = make(map[string]string)

	c.Set("time", time.Now().Format("15:04:05"))
	c.Set("server-time", time.Now().UTC().Format("15:04:05.000"))

	return &c
}

func (c *Data) Get(key string) string {
	c.mtx.Lock()
	defer c.mtx.Unlock()
	return c.data[key]
}

func (c *Data) Set(key, value string) {
	fmt.Println("Set", key, value)
	c.mtx.Lock()
	defer c.mtx.Unlock()
	c.data[key] = value
}
