package transport

type MessageHandler func(channel string, message Message, bindings ...map[string]interface{})

type PubSub interface {
	Publisher
	Subscriber
}

type Publisher interface {
	// Publish 
	Publish(channel string, msg Message, bindings ...map[string]interface{})
}

type Subscriber interface {
	Subscribe(channel string, fn MessageHandler, bindings ...map[string]interface{})
}