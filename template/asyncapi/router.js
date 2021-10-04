const { File } = require('@asyncapi/generator-react-sdk');
import { Router } from '../../components/Router';
import { GetSubscriberFlags } from '../../components/common';

export default async function({ asyncapi, params }) {
  const subscriberFlags = GetSubscriberFlags(asyncapi);

  if (!subscriberFlags.hasAMQPSub) {
    return;
  }

  return (
    <File name="router.go">
      <Router moduleName={params.moduleName} channels={asyncapi.channels()} subscriberFlags={subscriberFlags} />    
    </File>
  );
}