//render an AMQP subscriber
function AMQPSubscriber() {
  return `
// GetAMQPSubscriber returns an amqp subscriber based on the URI   
func GetAMQPSubscriber(amqpURI string) (*amqp.Subscriber, error) {
    amqpConfig := amqp.NewDurableQueueConfig(amqpURI)

    return amqp.NewSubscriber(
        amqpConfig,
        watermill.NewStdLogger(false, false),
    )
}
    `;
}
  
export function Subscriber({subscriberFlags}) {
  const amqpMod = 'github.com/ThreeDotsLabs/watermill-amqp/pkg/amqp';

  const modules = [];
  const subscribers = [];
  let importMod = '';
  let subscriberBlock = '';
  if (subscriberFlags.hasAMQPSub) {
    modules.push(amqpMod);
    subscribers.push(AMQPSubscriber());
  }

  if (modules.length > 0) {
    importMod = modules.map(m => `"${m}"`).join('\n');
  }

  if (subscribers.length > 0) {
    subscriberBlock = subscribers.join('\n');
  }

  return `
package asyncapi

import (
    "github.com/ThreeDotsLabs/watermill"
    ${importMod}
)

${subscriberBlock}
    `;
}