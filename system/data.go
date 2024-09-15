package system

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func (c *System) ThUpdateData() {
	for {
		c.UpdateData()
		time.Sleep(3 * time.Second)
	}
}

func (c *System) UpdateData() {
	c.Set("time", time.Now().Format("15:04:05"))
	c.Set("server-time", time.Now().UTC().Format("15:04:05.000"))

	c.GetCandles()
}

func (c *System) GetCandles() {
	time.Sleep(200 * time.Millisecond)
	requestLine := "https://api.bybit.com/v5/market/tickers?category=spot"
	resp, err := http.Get(requestLine)
	if err != nil {
		fmt.Println(err)
		return
	}
	//fmt.Println("Status:", resp.StatusCode)
	buf := make([]byte, 10*1024*1024)
	data := make([]byte, 0)
	for {
		n, err := resp.Body.Read(buf)
		if n == 0 {
			break
		}
		if err != nil {
			fmt.Println("err:", err)
		}
		data = append(data, buf[:n]...)
	}
	//fmt.Println(string(data), err)

	type HeaderResponse struct {
		RetCode int    `json:"retCode"`
		RetMsg  string `json:"retMsg"`
	}

	type StringList []string

	type Ticker struct {
		Symbol    string `json:"symbol"`
		LastPrice string `json:"lastPrice"`
	}

	type GetCandlesResponseInt struct {
		Category string   `json:"category"`
		List     []Ticker `json:"list"`
	}

	type GetCandlesResponse struct {
		HeaderResponse
		Result GetCandlesResponseInt `json:"result"`
	}

	var v GetCandlesResponse
	err = json.Unmarshal(data, &v)
	if err != nil {
		fmt.Println("Unmarshal error:", err)
	}

	for _, ticker := range v.Result.List {
		c.Set("price-"+ticker.Symbol, ticker.LastPrice)
	}
}
