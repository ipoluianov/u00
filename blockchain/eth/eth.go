package eth

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/ipoluianov/gomisc/logger"
	"github.com/ipoluianov/u00/data"
)

type Eth struct {
	url    string
	client *ethclient.Client
}

func NewEth() *Eth {
	var c Eth
	c.url = "wss://ethereum-rpc.publicnode.com"
	return &c
}

func (c *Eth) Start() {

	bsEndpoint, err := os.ReadFile("endpoints/eth.txt")
	if err != nil {
		logger.Println("Read Eth endpoint error:", err)
	}

	c.url = string(bsEndpoint)

	go c.ThWork()
}

func (c *Eth) Stop() {
}

func (c *Eth) ThWork() {
	var err error
	c.client, err = ethclient.Dial(c.url)
	if err != nil {
		log.Fatalf("Failed to connect to the Ethereum client: %v", err)
	}

	for {
		time.Sleep(1 * time.Second)
		blockNumber, err := c.getLatestBlockNumber()
		if err != nil {
			fmt.Println("error:", err)
			continue
		}

		var d struct {
			Header string `json:"Header"`
			Value1 string `json:"Value1"`
			Value2 string `json:"Value2"`
		}
		d.Header = "ETH CURRENT BLOCK"
		d.Value2 = fmt.Sprintf("%d", blockNumber)
		//d.Value2 = fmt.Sprintf("%d", blockNumber)
		dStr, _ := json.MarshalIndent(d, "", " ")

		data.DATA.Set("eth-block-number", string(dStr))
	}
}

func (c *Eth) getLatestBlockNumber() (uint64, error) {
	blockNumber, err := c.client.BlockNumber(context.Background())
	if err != nil {
		log.Fatalf("Failed to get latest block number: %v", err)
	}
	return blockNumber, nil
}
