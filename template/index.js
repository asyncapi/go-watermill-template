import { File } from '@asyncapi/generator-react-sdk';
import { GetSubscriberFlags, GetPublisherFlags, hasPubOrSub, hasSub} from '../components/common';
import { publishConfigsFrom } from '../components/Handlers';

function getAMQPPublishFn(channels) {
  return Object.entries(channels)
    .map(([channelName, channel]) => {
      if (channel.hasSubscribe() && channel.bindings().amqp) {
        //generate publisher
        const pubConfig = publishConfigsFrom(channelName, channel);
        const msgName = pubConfig.message.toLowerCase();
        return `
  var ${msgName} asyncapi.${pubConfig.message}
  //constrcut your message here
  err = asyncapi.${pubConfig.operation}(ctx, amqpPub, ${msgName})
  if err != nil {
    return err
  }
      `;
      }
    }).join('');
}

function renderStartAMQPPublishers(channels) {
  return `
func startAMQPPublishers(ctx context.Context) error {
  amqpPub, err := asyncapi.GetAMQPPublisher(asyncapi.GetAMQPURI())
  ${getAMQPPublishFn(channels)}
  return nil
}
  `;
}

function renderStartAMQPSubscribers() {
  return `
func startAMQPSubscribers(ctx context.Context, router *message.Router) error {
  amqpSubscriber, err := asyncapi.GetAMQPSubscriber(asyncapi.GetAMQPURI())
  if err != nil {
    return err
  }

  asyncapi.ConfigureAMQPSubscriptionHandlers(router, amqpSubscriber)
  return nil
}
  `;
}

function renderSubscribers (subscriberFlags) {
  let subscriberConfig = `
  router, err := asyncapi.GetRouter()
  if err != nil {
    log.Fatalf("error getting router: %s", err)
  }
  `;

  if (subscriberFlags.hasAMQPSub) {
    subscriberConfig += `
  err = startAMQPSubscribers(ctx, router)
  if err != nil {
    log.Fatalf("error starting amqp subscribers: %s", err)
  }
    `;
  }

  subscriberConfig += `
  if err = router.Run(ctx); err != nil {
    log.Fatalf("error running watermill router: %s", err)
  }
  `;

  return subscriberConfig;
}

function renderPublishers (publisherFlags) {
  let publisherConfig = '';

  if (publisherFlags.hasAMQPPub) {
    publisherConfig += `
  err := startAMQPPublishers(ctx)
  if err != nil {
    log.Fatalf("error starting amqp publishers: %s", err)
  }
    `;
  }

  return publisherConfig;
}

function renderDependencies(moduleName, doc) {
  let imports = `
import (
  "context"
  "log"
  "os"
  "os/signal"
  "syscall"
  "${moduleName}/asyncapi"
`;

  if (hasSub(doc)) {
    imports += `
  "github.com/ThreeDotsLabs/watermill/message"
    `;
  }

  imports += `
)
  `;

  return imports;
}

/*
 * Each template to be rendered must have as a root component a File component,
 * otherwise it will be skipped.
 *
 * If you don't want to render anything, you can return `null` or `undefined` and then Generator will skip the given template.
 *
 * Below you can see how reusable chunks (components) could be called.
 * Just write a new component (or import it) and place it inside the File or another component.
 *
 * Notice that you can pass parameters to components. In fact, underneath, each component is a pure Javascript function.
 */
export default function({ asyncapi, params }) {
  const informativeErrMsg = `
    Since there are no supported channels in the asyncapi document there is no code to output
    Currently supported channels are:
      AMQP Subscriber
      AMQP Publisher
  `;
  //if there are no supported channels do nothing
  if (!hasPubOrSub(asyncapi)) {
    console.log(`${informativeErrMsg}`);
    return;
  }

  const subscriberFlags = GetSubscriberFlags(asyncapi);
  const publisherFlags = GetPublisherFlags(asyncapi);

  return (
    <File name="main.go">
      {`
package main

${renderDependencies(params.moduleName, asyncapi)}

func main() {
  ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM, syscall.SIGINT)
  defer stop()

  ${renderPublishers(publisherFlags)}
  ${subscriberFlags.hasAMQPSub ? renderSubscribers(subscriberFlags) : ''}
}

${renderStartAMQPPublishers(asyncapi.channels())}
${subscriberFlags.hasAMQPSub ? renderStartAMQPSubscribers(): ''}

`}
    </File>
  );
}
