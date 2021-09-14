//render an AMQP subscriber
function AMQPSubscriber() {
    return `
func GetAMQPSubscriber(amqpURI string) (*amqp.Subscriber, error) {
    amqpConfig := amqp.NewDurableQueueConfig(amqpURI)

    amqpSubscriber, err := amqp.NewSubscriber(
        amqpConfig,
        watermill.NewStdLogger(false, false),
    )
    if err != nil {
        return nil, err
    }
    return amqpSubscriber, nil
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