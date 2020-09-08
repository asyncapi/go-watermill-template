package message

import (
	"asyncapi/model"
	"asyncapi/transport"
)

// TurnOnOff is used to command a particular streetlight to turn the lights on or off.
type TurnOnOff struct {
	transport.Message

	// ContentType indicates the specified MIME type for this message. If empty, the defaultContentType should be used 
	ContentType string
	
	// Payload contains the content defined by the payload AsyncAPI field
	Payload model.TurnOnOffPayload
}