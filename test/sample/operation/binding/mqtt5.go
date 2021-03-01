package binding

// MQTT5 defines the operation bindings for the MQTT5 protocol
type MQTT5 {
	// QoS defines how hard the broker/client will try to ensure that a message is received. 
	// Its value MUST be either 0, 1 or 2.
	QoS integer
	
	// Retain specifies whether the broker should retain the message or not.
	Retain bool

	// BindingVersion specifies the version of this binding. If omitted, "latest" MUST be assumed.
	BindingVersion string
}