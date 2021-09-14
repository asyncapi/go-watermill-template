const { File } = require('@asyncapi/generator-react-sdk');
import { Subscriber } from '../../components/Subscriber';
import { GetSubscriberFlags } from '../../components/common';

export default async function({ asyncapi }) {

    let subscriberFlags = GetSubscriberFlags(asyncapi);

    if (!subscriberFlags.hasAMQPSub) {
        return
    }

    return (
      <File name="subscribers.go">
         <Subscriber subscriberFlags={subscriberFlags} />    
      </File>
    );
  }