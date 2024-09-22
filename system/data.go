package system

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func (c *System) ThUpdateData() {
	for {
		c.UpdateData()
		time.Sleep(1 * time.Second)
	}
}

func (c *System) UpdateData() {
	c.Set("time", time.Now().Format("15:04:05"))
	c.Set("server-time", time.Now().UTC().Format("15:04:05.000"))

	c.GetCandles()
}

func (c *System) GetCandles() {
	time.Sleep(50 * time.Millisecond)
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

	type PriceStruct struct {
		DT     string
		Ticker string
		Name   string
		Price1 string
		Price2 string
	}

	for _, ticker := range v.Result.List {
		price := ticker.LastPrice
		price1 := price
		price2 := ""
		indexOfPoint := strings.Index(price, ".")
		if indexOfPoint > -1 {
			price1 = price[:indexOfPoint]
			price2 = price[indexOfPoint+1:]

			priceValue, err := strconv.ParseFloat(price, 64)
			if err == nil {
				if priceValue > 1 {
					for len(price2) < 2 {
						price2 += "0"
					}
				}

				if priceValue < 1 {
					for len(price2) < 6 {
						price2 += "0"
					}
				}
			}
		} else {
			price2 = "00"
		}

		var item PriceStruct
		item.DT = time.Now().Format("2006-01-02 15:04:05")
		item.Ticker = ticker.Symbol
		item.Name = strings.ReplaceAll(ticker.Symbol, "USDT", "")
		item.Price1 = price1
		item.Price2 = price2
		bs, _ := json.MarshalIndent(item, "", " ")
		c.Set("price-"+ticker.Symbol, string(bs))
	}
}
