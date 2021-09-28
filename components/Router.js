import { render } from '@asyncapi/generator-react-sdk';
import { pascalCase } from './common';

const addHandlerFunction = (queue, operation) => `
  r.AddNoPublisherHandler(
    "${operation}",     // handler name, must be unique
    "${queue}",         // topic from which we will read events
    s,
    ${operation}, 
  )
`;

function AMQPRouterRules({ channels }) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (channel.hasPublish()) {
        const operation = pascalCase(channel.publish().id());
        const queue = channel.bindings().amqp.queue.name;
        return  addHandlerFunction(queue, operation);
      }
      return '';
    });
}

export function Router({moduleName, channels, subscriberFlags}) {
  let amqpRules = '';
  if (subscriberFlags.hasAMQPSub) {
    amqpRules = `
// ConfigureAMQPSubscriptionHandlers configures the router with the subscription handler.    
func ConfigureAMQPSubscriptionHandlers(r *message.Router, s message.Subscriber) {
${render(<AMQPRouterRules channels={channels} />)}
}    
`;
  }  

  return `
package asyncapi

import (
	"github.com/ThreeDotsLabs/watermill"
	"github.com/ThreeDotsLabs/watermill/message"
)

// GetRouter returns a watermill router. 
func GetRouter() (*message.Router, error){
	logger := watermill.NewStdLogger(false, false)
	return message.NewRouter(message.RouterConfig{}, logger)
}

${amqpRules}
  `;
}