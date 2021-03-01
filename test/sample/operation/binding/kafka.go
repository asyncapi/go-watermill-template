package binding

package binding

// Kafka defines the operation bindings for the Kafka protocol
type Kafka {
	// GroupID is the ID of the consumer group.
	GroupID string
	
	// ClientID is the ID of the consumer inside a consumer group.
	ClientID string

	// BindingVersion specifies the version of this binding. If omitted, "latest" MUST be assumed.
	BindingVersion string
}