package message

import (
	"asyncapi/model"
	"asyncapi/transport"
)

// DimLight is used to command a particular streetlight to dim the lights.
type DimLight struct {
	transport.Message

	// ContentType indicates the specified MIME type for this message. If empty, the defaultContentType should be used 
	ContentType string
	
	// Payload contains the content defined by the payload AsyncAPI field
	Payload model.DimLightPayload
}