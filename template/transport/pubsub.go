package transport

type MessageHandler func(channel string, message Message, bindings ...msgBindings map[string]interface{})

type PubSub interface {
	Publish
	Subscribe
}

type interface Publisher {
	// Publish 
	Publish(channel string, msg Message, bindings ...opBindings map[string]interface{})
}

type interface Subscriber {
	Subscribe(channel string, fn MessageHandler, bindings ...opBindings map[string]interface{})
}