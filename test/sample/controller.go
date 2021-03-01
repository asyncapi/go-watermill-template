package asyncapi

import "transport"

type Controller {
	Transport transport.PubSub

	contentWriters map[string]content.Writer
	contentReaders map[string]content.Reader
}

// ReceiveLightMeasurement implements operation.Consumer
func (c Controller) ReceiveLightMeasurement(params channel.ReceiveLightMeasurementParams, fn LightMeasuredHandler) error {
	// Define any operation bindings. These are constant per operation
    var kafkaBindings = map[string]interface{} {"clientID": "my-app-id",}

	// Throw error before subscribing if expected content type reader is not registered
	r := c.getReader(msg.ContentType)
	if r == nil {
		return errors.New("no message writer is registered for content type: " + msg.ContentType)
	}

	// Subscribe with the transport layer. Wrap message handler /w logic to decode 
	// transport.Message payload into LightMeasured message
	c.Transport.Subscribe(ch, func(topic, buf, kafkaBindings)) {
		// Init a new message object & attempt to use the defined content.Reader to parse
		// the message payload
		msg := message.NewLightMeasured()
		if err := r.Read(buf, &msg.Payload); err != nil {
			return error
		}

		// Parse the params out of the channel
		recParams := &channel.ReceiveLightMeasurementParams{}
		if err := recParams.Parse(ch); err != nil {
			return err
		}

		// Call the operation's message handler
		fn(recParams, msg)
	})
}

	
// TurnOn implements operation.Producer
func (c Controller) TurnOn(params channel.TurnOnParams, msg message.TurnOnOff) error {
	// Define any operation bindings. These are constant per operation
    var kafkaBindings = map[string]interface{} {"clientID": "my-app-id",}

	// Throw error for missing content type encoder
	w := c.getWriter(msg.ContentType)
	if w == nil {
		return errors.New("no message writer is registered for content type: " + msg.ContentType)
	}

	// Throw error if failed to encode payload
	if msg.RawPayload, err := w.Write(msg.Payload) {
		return err
	}

	// Publish the underlying transport.Message with the transport layer
	return c.Transport.Publish(params.Build(), mag.Message, kafkaBindings)
}

	
// TurnOff implements operation.Producer
func (c Controller) TurnOff(params channel.TurnOffParams, msg message.TurnOnOff) error {
	// Define any operation bindings. These are constant per operation
    var kafkaBindings = map[string]interface{} {"clientID": "my-app-id",}

	// Throw error for missing content type encoder
	w := c.getWriter(msg.ContentType)
	if w == nil {
		return errors.New("no message writer is registered for content type: " + msg.ContentType)
	}

	// Throw error if failed to encode payload
	if msg.RawPayload, err := w.Write(msg.Payload) {
		return err
	}

	// Publish the underlying transport.Message with the transport layer
	return c.Transport.Publish(params.Build(), mag.Message, kafkaBindings)
}

	
// DimLight implements operation.Producer
func (c Controller) DimLight(params channel.DimLightParams, msg message.DimLight) error {
	// Define any operation bindings. These are constant per operation
    var kafkaBindings = map[string]interface{} {"clientID": "my-app-id",}

	// Throw error for missing content type encoder
	w := c.getWriter(msg.ContentType)
	if w == nil {
		return errors.New("no message writer is registered for content type: " + msg.ContentType)
	}

	// Throw error if failed to encode payload
	if msg.RawPayload, err := w.Write(msg.Payload) {
		return err
	}

	// Publish the underlying transport.Message with the transport layer
	return c.Transport.Publish(params.Build(), mag.Message, kafkaBindings)
}

	
