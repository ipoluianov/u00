package system

type System struct {
}

func NewSystem() *System {
	var c System
	return &c
}

func (c *System) Start() {
}

func (c *System) Stop() {
}
