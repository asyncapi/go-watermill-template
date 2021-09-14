import { render } from '@asyncapi/generator-react-sdk';
import { pascalCase } from './common';


let subscriptionFunction = (channelName, operation, message) => `
// subscription handler for ${channelName}        
func ${operation}(msg *message.Message) error {

    log.Printf("received message payload: %s", string(msg.Payload))

    var lm payloads.${message}
    err := json.Unmarshal(msg.Payload, &lm)
    if err != nil {
        fmt.Printf("error unmarshalling message: %s, err is: %s", msg.Payload, err)
        return err
    }

    return nil
}
`;

function SubscriptionHandlers({ channels }) {
    return Object.entries(channels)
            .map(([channelName, channel]) => {
                if ( channel.hasPublish()) {
                    let operation = pascalCase(channel.publish().id())
                    let message = pascalCase(channel.publish().message(0).payload().$id())
                    return  subscriptionFunction(channelName, operation, message);
                }
                return "";
            });
}

export function Handlers({ moduleName, channels}) {
return `
package handlers

import (
    "encoding/json"
    "fmt"
    "github.com/ThreeDotsLabs/watermill/message"
    "${moduleName}/payloads"
    "log"
)
${render(<SubscriptionHandlers channels={channels} />)}
`
}