const { File } = require('@asyncapi/generator-react-sdk');
import { Server } from '../../components/Server';
import { GetProtocolFlags } from '../../components/common';

export default async function({ asyncapi }) {
  const protocolFlags = GetProtocolFlags(asyncapi);
  if (!protocolFlags.hasAMQP) {
    return;
  }

  return (
    <File name="server.go">
      <Server protocolFlags={protocolFlags} />    
    </File>
  );
}