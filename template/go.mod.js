import { File } from '@asyncapi/generator-react-sdk';
import { GetProtocolFlags } from '../components/common';

export default function({ asyncapi, params }) {
  const protocolFlags = GetProtocolFlags(asyncapi);
  const module = [];
  let dependencies = '';

  if (!protocolFlags.hasAMQP) {
    return;
  }

  if (protocolFlags.hasAMQP) {
    module.push('github.com/ThreeDotsLabs/watermill-amqp v1.1.2');
  }

  if (module.length > 0) {
    dependencies = module.join('\n');
  }

  return (
    <File name="go.mod">
      {`
module ${params.moduleName}

go ${params.goVersion}

require (
  github.com/ThreeDotsLabs/watermill v1.1.1
  ${dependencies}
)
  `}
    </File>
  );
}