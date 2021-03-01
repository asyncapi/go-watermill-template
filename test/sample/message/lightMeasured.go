package message

import (
	"asyncapi/model"
	"asyncapi/transport"
)

// LightMeasured is used to inform about environmental lighting conditions for a particular streetlight.
type LightMeasured struct {
	transport.Message

	// ContentType indicates the specified MIME type for this message. If empty, the defaultContentType should be used 
	ContentType string
	
	// Payload contains the content defined by the payload AsyncAPI field
	Payload model.LightMeasuredPayload
}