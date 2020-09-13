package transport

import "context"

// Message contains the payload and headers sent or received from the 
// transport implementation
type Message struct {
	// context holds the context application context of this message
	// it can be used to pass tracing information & signal timeouts for pub/sub operations
	context context.Context

	// Headers contain the custom header values sent/received alongside a message payload
	Headers map[string]string

	// RawPayload contains the serialized binary payload of the message
	RawPayload []byte
}

// NewMessage instantiates a new message with the provided context
func NewMessage(ctx context.Context) Message {
	return Message{
		context:    ctx,
		Headers:    make(map[string]string),
		RawPayload: nil,
	}
}

// Context returns the associated message Context
func (msg Message) Context() context.Context {
	return msg.context
}


// WithContext returns a new instance of msg with the provided context
func (msg Message) WithContext(ctx context.Context) Message {
	msg.context = ctx
	return msg
}