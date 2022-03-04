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

export function SubscriptionHandlers({ channels }) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (channel.hasPublish()) {
        const operation = pascalCase(channel.publish().id());
        const msgName = channel.publish().message(0).uid();
        const message = pascalCase(msgName);
        return subscriptionFunction(channelName, operation, message);
      }
      return ''
    }).join('');
}

export function PublishHandlers({ channels }) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (channel.hasSubscribe()) {
        const operation = pascalCase(channel.subscribe().id());
        const msgName = channel.subscribe().message(0).uid();
        const message = pascalCase(msgName);
        //check if it has amqp subscribers
        if (channel.bindings().amqp) {
          //generate amqp publisher
          return amqpPublisherFunction(channelName, operation, message)
        }
      }
      return '';
    }).join('');
}

const amqpPublisherFunction = (channelName, operation, message) => `
// ${operation} publish handler for ${channelName}.
func ${operation}(a *amqp.Publisher, payload ${message}) error {

  m, err := PayloadToMessage(payload)
  if err != nil {
      log.Fatalf("error converting payload: %+v to message error: %s", payload, err)
  }

  return a.Publish("${channelName}", &m)
}
`;

export function Imports(channels) {
  // console.log(JSON.stringify(channels))

  return Object.entries(channels)
    .map(([channelName, channel]) => {
      let dependencies = ''
      if (channel.hasPublish()) {
        dependencies += `
    "encoding/json"
    "github.com/ThreeDotsLabs/watermill/message"
        `
      }

      if (channel.hasSubscribe()) {
        if (channel.bindings().amqp) {
          dependencies += `
    "github.com/ThreeDotsLabs/watermill-amqp/pkg/amqp"
      `
        }
      }
      return dependencies
    });
}



export function Handlers({channels}) {
  return `
package asyncapi

import (
	"log"
  ${Imports(channels)}
)
${render(<SubscriptionHandlers channels={channels} />)}
${render(<PublishHandlers channels={channels} />)}
`;
}
