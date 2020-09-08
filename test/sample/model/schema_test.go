package model_test

import (
	"log"
	"testing"
	"encoding/json"

	"asyncapi/model"
)

func TestParse(t *testing.T) {
	m := model.TurnOnOffPayload{}
	raw := []byte(`{"command": "test", "sentAt": "myTime"}`)

	if err := json.Unmarshal(raw, &m); err != nil {
        panic(err)
	}
	log.Printf("%v", m)
	log.Println(*m.Command)
	log.Println(*m.SentAt)
	t.Fail()
}