import { File } from '@asyncapi/generator-react-sdk';


//render an AMQP subscriber
function AMQPSubscriber() {
  return `
  amqpSubscriber, err := config.GetAMQPSubscriber(config.GetAMQPURI())
  if err != nil {
    log.Fatalf("error creating amqpSubscriber: %s", err)
    return
  }

  config.ConfigureAMQPSubscriptionHandlers(router, amqpSubscriber)
  `
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
  
  const channelEntries = Object.keys(asyncapi.channels()).length ? Object.entries(asyncapi.channels()) : [];
  //if there are no channels do nothing
  if (channelEntries.length === 0) {
      console.log("Since there are no channels in the asyncapi document no code is being generated")
      return
  }

  //if there are no subscribers then do nothing
  let hasAMQPSubscriber = channelEntries.filter(([channelName, channel]) => {
      return channel.hasPublish() && channel.bindings().amqp
  }).length > 0;

  if (!hasAMQPSubscriber) {
      return
  }

  let subscriberFlags = {
      hasAMQPSubscriber: hasAMQPSubscriber
  }

  let subscribers = []
  let subscriberConfig = ""

  if (subscriberFlags.hasAMQPSubscriber) {
    subscribers.push(AMQPSubscriber())
  }

  if ( subscribers.length > 0 ) {
    subscriberConfig = subscribers.join("\n")
  }

  return (
    <File name="main.go">
{`
package main

import (
	"context"
  "log"
  "os"
  "os/signal"
  "syscall"
	"${params.moduleName}/config"
)

func main() {
  router, err := config.GetRouter()
  if err != nil {
    log.Fatalf("error creating watermill router: %s", err)
    return
  }

  ${subscriberConfig}

  ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM, syscall.SIGINT)
  defer stop()
  if err = router.Run(ctx); err != nil {
    log.Fatalf("error running watermill router: %s", err)
    return
  }
}

`}
    </File>
  );
}