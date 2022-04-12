//render an AMQP subscriber
function AMQPPublisher() {
  return `
// GetAMQPPublisher returns an amqp publisher based on the URI
func GetAMQPPublisher(amqpURI string) (*amqp.Publisher, error) {
    amqpConfig := amqp.NewDurableQueueConfig(amqpURI)

    return amqp.NewPublisher(
        amqpConfig,
        watermill.NewStdLogger(false, false),
    )
}
    `;
}

export function Publisher({publisherFlags}) {
  const amqpMod = 'github.com/ThreeDotsLabs/watermill-amqp/pkg/amqp';

  const modules = [];
  const publishers = [];
  let importMod = '';
  let publisherBlock = '';
  if (publisherFlags.hasAMQPPub) {
    modules.push(amqpMod);
    publishers.push(AMQPPublisher());
  }

  if (modules.length > 0) {
    importMod = modules.map(m => `"${m}"`).join('\n');
  }

  if (publishers.length > 0) {
    publisherBlock = publishers.join('\n');
  }

  return `
package asyncapi

import (
    "github.com/ThreeDotsLabs/watermill"
    ${importMod}
)

${publisherBlock}
    `;
}
