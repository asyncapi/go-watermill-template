import { render } from '@asyncapi/generator-react-sdk';
import { pascalCase } from './common';

const subscriptionFunction = (channelName, operation, message) => `
// ${operation} subscription handler for ${channelName}.        
func ${operation}(msg *message.Message) error {
    log.Printf("received message payload: %s", string(msg.Payload))

    var lm ${message}
    err := json.Unmarshal(msg.Payload, &lm)
    if err != nil {
        log.Printf("error unmarshalling message: %s, err is: %s", msg.Payload, err)
    }
    return nil
}
`;

function SubscriptionHandlers({ channels }) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (channel.hasPublish()) {
        const operation = pascalCase(channel.publish().id());
        const message = pascalCase(channel.publish().message(0).payload().$id());
        return  subscriptionFunction(channelName, operation, message);
      }
      return '';
    });
}

export function Handlers({ moduleName, channels}) {
  return `
package asyncapi

import (
	"encoding/json"
	"log"

	"github.com/ThreeDotsLabs/watermill/message"
)
${render(<SubscriptionHandlers channels={channels} />)}
`;
}