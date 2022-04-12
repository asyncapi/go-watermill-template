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
        if (!operation) {
          throw new Error('This template requires operationId to be set for every operation.');
        }

        const msgName = channel.publish().message(0).uid();
        const message = pascalCase(msgName);
        return subscriptionFunction(channelName, operation, message);
      }
      return '';
    }).join('');
}

export function publishConfigsFrom(channelName, channel) {
  const msgName = channel.subscribe().message(0).uid();
  const message = pascalCase(msgName);
  const operation = pascalCase(channel.subscribe().id());
  if (!operation) {
    throw new Error('This template requires operationId to be set for every operation.');
  }
  return {
    operation,
    message,
    channelName
  };
}

const amqpPublisherFunction = (channelName, operation, message) => `
// ${operation} is the publish handler for ${channelName}.
func ${operation}(ctx context.Context, a *amqp.Publisher, payload ${message}) error {
  m, err := PayloadToMessage(payload)
  if err != nil {
      log.Fatalf("error converting payload: %+v to message error: %s", payload, err)
  }

  return a.Publish("${channelName}", m)
}
`;

export function PublishHandlers({ channels }) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (channel.hasSubscribe() && channel.bindings().amqp) {
        //generate amqp publisher
        const pubConfig = publishConfigsFrom(channelName, channel);
        return amqpPublisherFunction(pubConfig.channelName, pubConfig.operation, pubConfig.message);
      }
      return '';
    }).join('');
}

export function Imports(channels) {
  const dependencies = new Set();
  for (const [, channel] of Object.entries(channels)) {
    if (channel.hasPublish()) {
      dependencies.add(`
  "encoding/json"
  "github.com/ThreeDotsLabs/watermill/message"`);
    }

    if (channel.hasSubscribe() && channel.bindings().amqp) {
      dependencies.add(`
  "context"
  "github.com/ThreeDotsLabs/watermill-amqp/pkg/amqp"`);
    }
  }
  return [...dependencies].join('\n');
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
