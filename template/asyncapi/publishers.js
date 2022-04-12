const { File } = require('@asyncapi/generator-react-sdk');
import { Publisher } from '../../components/Publisher';
import { GetPublisherFlags } from '../../components/common';

export default async function({ asyncapi }) {
  const publisherFlags = GetPublisherFlags(asyncapi);

  if (!publisherFlags.hasAMQPPub) {
    return;
  }

  return (
    <File name="publishers.go">
      <Publisher publisherFlags={publisherFlags} />
    </File>
  );
}
