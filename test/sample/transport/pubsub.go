package transport

type MessageHandler func(string, Message, ...map[string]interface{})

type PubSub interface {
	Publisher
	Subscriber
}

type Publisher interface {
	// Publish 
	Publish(channel string, msg Message, opBindings ...map[string]interface{})
}

type Subscriber interface {
	Subscribe(channel string, fn MessageHandler, opBindings ...map[string]interface{})
}