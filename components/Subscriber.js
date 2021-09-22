//render an AMQP subscriber
function AMQPSubscriber() {
    return `
// GetAMQPSubscriber returns an amqp subscriber   
func GetAMQPSubscriber(amqpURI string) (*amqp.Subscriber, error) {
    amqpConfig := amqp.NewDurableQueueConfig(amqpURI)

    return amqp.NewSubscriber(
        amqpConfig,
        watermill.NewStdLogger(false, false),
    )
}
    `
}
  
export function Subscriber({subscriberFlags}) {
    let amqpMod = "github.com/ThreeDotsLabs/watermill-amqp/pkg/amqp"

    let modules = []
    let subscribers = []
    let importMod = ""
    let subscriberBlock = ""
    if (subscriberFlags.hasAMQPSub) {
        modules.push(amqpMod)
        subscribers.push(AMQPSubscriber())
    }

    if ( modules.length > 0 ) {
        importMod = modules.map(m => `"${m}"`).join("\n")
    }

    if ( subscribers.length > 0 ) {
        subscriberBlock = subscribers.join("\n")
    }

    return `
package config

import (
    "github.com/ThreeDotsLabs/watermill"
    ${importMod}
)

${subscriberBlock}
    `
}