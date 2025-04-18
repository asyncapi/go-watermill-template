import { File } from '@asyncapi/generator-react-sdk';
import { GetProtocolFlags } from '../components/common';

export default function({ asyncapi, params }) {
  const protocolFlags = GetProtocolFlags(asyncapi);
  const modules = ['github.com/ThreeDotsLabs/watermill v1.1.1'];
  const goVersion = params.goVersion || '1.16';

  if (protocolFlags.hasAMQP) {
    modules.push('github.com/ThreeDotsLabs/watermill-amqp v1.1.2');
  }

  if (protocolFlags.hasKafka) {
    modules.push('github.com/ThreeDotsLabs/watermill-kafka v1.1.2');
  }

  const dependencies = modules.sort().join('\n');

  return (
    <File name="go.mod">
      {`
module ${params.moduleName}

go ${goVersion}

require (
  ${dependencies}
)
      `}
    </File>
  );
}
