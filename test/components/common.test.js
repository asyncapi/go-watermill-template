import { GetProtocolFlags, GetSubscriberFlags, pascalCase } from '../../components/common';
import AsyncAPIDocument from '@asyncapi/parser/lib/models/asyncapi';

const docWithoutChannels = new AsyncAPIDocument({
  asyncapi: '2.1.0',
  info: {
    title: "Streetlights API",
    version: '1.0.0',
    description: "The Smartylighting Streetlights API",
  }
});

const docWithChannels = new AsyncAPIDocument({
  asyncapi: '2.1.0',
  info: {
    title: "Streetlights API",
    version: '1.0.0',
    description: "The Smartylighting Streetlights API",
  },
  channels: {
    "light/measured": {
      bindings: {
        amqp: {
          is: "routingKey",
          queue: {
            name: "light/measured",
            durable: true,
            exclusive: true,
            autoDelete: false,
            vhost: "/"
          },
          bindingVersion: "0.2.0"
        }
      }
    }
  }
});

const docWithAMQPPublisher = new AsyncAPIDocument({
  asyncapi: '2.1.0',
  info: {
    title: "Streetlights API",
    version: '1.0.0',
    description: "The Smartylighting Streetlights API",
  },
  channels: {
    "light/measured": {
      bindings: {
        amqp: {
          is: "routingKey",
          queue: {
            name: "light/measured",
            durable: true,
            exclusive: true,
            autoDelete: false,
            vhost: "/"
          },
          bindingVersion: "0.2.0"
        }
      },
      publish: {
        summary: "Inform about environmental lighting conditions for a particular streetlight",
        operationId: "onLightMeaasured",
        message: {
          name: "LightMeasured",
          payload: {
            "$id": "LightMeasured",
            additionalProperties: false,
            type: "object",
            properties: {
              id: {
                type: "integer",
                minimum: 0,
                description : "Id of the streetlight."
              },
              lumens: {
                type: "integer",
                minimum: 0,
                description: "Light intensity measured in lumens."
              },
              sentAt: {
                type: "string",
                format: "date-time",
                description: "Date and time when the message was sent."
              }
            }
          }
        }
      }
    }
  }
});

describe('GetProtocolFlags', () => {

  it('should return protocols as false when no channels are present ', () => {
    const expected = {
      hasAMQP: false
    };

    const result = GetProtocolFlags(docWithoutChannels);
    expect(result).toEqual(expected);
  })

  it('should return amqp as true when channels with amqp bindings are present ', () => {
    const expected = {
      hasAMQP: true
    };

    const result = GetProtocolFlags(docWithChannels);
    expect(result).toEqual(expected);
  })

})

describe('GetSubscriberFlags', () => {
  it('should return subscriberFlags as false when no channels are present ', () => {
    const expected = {
      hasAMQPSub: false
    };

    const result = GetSubscriberFlags(docWithoutChannels);
    expect(result).toEqual(expected);
  })

  it('should return subscriberFlags as false when publish channels are NOT present', () => {
    const expected = {
      hasAMQPSub: false
    };

    const result = GetSubscriberFlags(docWithChannels);
    expect(result).toEqual(expected);
  })

  it('should return subscriberFlags as true when publish channels are present', () => {
    const expected = {
      hasAMQPSub: true
    };

    const result = GetSubscriberFlags(docWithAMQPPublisher);
    expect(result).toEqual(expected);
  })
})

describe('pascalCase', () => {
  it('should convert string to pascalCase ', () => {
    const expected = "PS"

    const result = pascalCase("pS");
    expect(result).toEqual(expected);
  })
})
