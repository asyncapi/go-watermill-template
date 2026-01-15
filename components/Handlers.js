import { render } from '@asyncapi/generator-react-sdk';
import { pascalCase, hasPublishCompat, hasSubscribeCompat, getPublishOperationCompat, getSubscribeOperationCompat } from './common';

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

export function SubscriptionHandlers({ channels, asyncapi }) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (hasPublishCompat(channel, asyncapi)) {
        const publishOp = getPublishOperationCompat(channel, asyncapi);
        const operation = pascalCase(publishOp.id());
        if (!operation) {
          throw new Error('This template requires operationId to be set for every operation.');
        }

        const msgName = publishOp.message(0).uid();
        const message = pascalCase(msgName);
        return subscriptionFunction(channelName, operation, message);
      }
      return '';
    }).join('');
}

export function publishConfigsFrom(channelName, channel, asyncapi) {
  const subscribeOp = getSubscribeOperationCompat(channel, asyncapi);
  const msgName = subscribeOp.message(0).uid();
  const message = pascalCase(msgName);
  const operation = pascalCase(subscribeOp.id());
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

export function PublishHandlers({ channels, asyncapi }) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (hasSubscribeCompat(channel, asyncapi) && channel.bindings().amqp) {
        //generate amqp publisher
        const pubConfig = publishConfigsFrom(channelName, channel, asyncapi);
        return amqpPublisherFunction(pubConfig.channelName, pubConfig.operation, pubConfig.message);
      }
      return '';
    }).join('');
}

export function Imports(channels, asyncapi) {
  const dependencies = new Set();
  for (const [, channel] of Object.entries(channels)) {
    if (hasPublishCompat(channel, asyncapi)) {
      dependencies.add(`
  "encoding/json"
  "github.com/ThreeDotsLabs/watermill/message"`);
    }

    if (hasSubscribeCompat(channel, asyncapi) && channel.bindings().amqp) {
      dependencies.add(`
  "context"
  "github.com/ThreeDotsLabs/watermill-amqp/pkg/amqp"`);
    }
  }
  return [...dependencies].join('\n');
}

export function Handlers({ channels, asyncapi }) {
  return `
package asyncapi

import (
	"log"
  ${Imports(channels, asyncapi)}
)
${render(<SubscriptionHandlers channels={channels} asyncapi={asyncapi} />)}
${render(<PublishHandlers channels={channels} asyncapi={asyncapi} />)}
`;
}
