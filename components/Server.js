function AMQPURI() {
  return `
// GetAMQPURI return the AMQP URI.
//TODO this must be done using the async api server bindings    
func GetAMQPURI() string {
  //this must be passed in or created by the app based on the bindings
  return "amqp://guest:guest@localhost:5672/"
}
    `;
}
  
export function Server({protocolFlags}) {
  const configs = [];
  let configBlock = '';
  if (protocolFlags.hasAMQP) {
    configs.push(AMQPURI());
  }
  
  if (configs.length > 0) {
    configBlock = configs.join('\n');
  }
  
  return `
package asyncapi

${configBlock}
  `;
}