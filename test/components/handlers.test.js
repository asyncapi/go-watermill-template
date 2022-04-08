import { SubscriptionHandlers, PublishHandlers, Imports} from '../../components/Handlers';
import { render } from '@asyncapi/generator-react-sdk';
import parser from '@asyncapi/parser'
import fs from 'fs'
import path from 'path'

const docWithAMQPublisher = fs.readFileSync(path.resolve(__dirname, '../files/docWithAMQPublisher.yml'), 'utf8');
const docWithoutAMQPublisher = fs.readFileSync(path.resolve(__dirname, '../files/docWithoutAMQPublisher.yml'), 'utf8');
const docWithAMQPSubscriber = fs.readFileSync(path.resolve(__dirname, '../files/docWithAMQPSubscriber.yml'), 'utf8');

describe('SubscriptionHandlers', () => {

  it('should return a subscription handler function', async function() {
    const expected = `
// OnLightMeasured subscription handler for light/measured.
func OnLightMeasured(msg *message.Message) error {
    log.Printf("received message payload: %s", string(msg.Payload))

    var lm LightMeasured
    err := json.Unmarshal(msg.Payload, &lm)
    if err != nil {
        log.Printf("error unmarshalling message: %s, err is: %s", msg.Payload, err)
    }
    return nil
}

// OnTempMeasured subscription handler for temp/measured.
func OnTempMeasured(msg *message.Message) error {
    log.Printf("received message payload: %s", string(msg.Payload))

    var lm TempMeasured
    err := json.Unmarshal(msg.Payload, &lm)
    if err != nil {
        log.Printf("error unmarshalling message: %s, err is: %s", msg.Payload, err)
    }
    return nil
}
    `

    const doc = await parser.parse(docWithAMQPublisher);
    const result = render(<SubscriptionHandlers channels={doc.channels()} />)
    expect(result.trim()).toEqual(expected.trim());
  })

  it('should not return anything when there are no publishers', async function() {
    const doc = await parser.parse(docWithoutAMQPublisher);
    const result = render(<SubscriptionHandlers channels={doc.channels()} />)
    expect(result).toEqual('');
  })

})

describe('PublishHandlers', () => {

  it('should return publish handler functions', async function() {
    const expected = `
// LumenPublish is the publish handler for light/measured.
func LumenPublish(ctx context.Context, a *amqp.Publisher, payload LightMeasured) error {
  m, err := PayloadToMessage(payload)
  if err != nil {
      log.Fatalf("error converting payload: %+v to message error: %s", payload, err)
  }

  return a.Publish("light/measured", m)
}

// TempPublish is the publish handler for temp/measured.
func TempPublish(ctx context.Context, a *amqp.Publisher, payload TempMeasured) error {
  m, err := PayloadToMessage(payload)
  if err != nil {
      log.Fatalf("error converting payload: %+v to message error: %s", payload, err)
  }

  return a.Publish("temp/measured", m)
}
    `
    const doc = await parser.parse(docWithAMQPSubscriber);
    const result = render(<PublishHandlers channels={doc.channels()} />)
    expect(result.trim()).toEqual(expected.trim());
  })
})

describe('Imports', () => {
  it('should return imports for subscribers', async function() {
    const expected = `
  "encoding/json"
  "github.com/ThreeDotsLabs/watermill/message"
    `
    const doc = await parser.parse(docWithAMQPublisher);
    const result = Imports(doc.channels())
    expect(result.trim()).toEqual(expected.trim())
  })

  it('should return imports for publishers', async function() {
    const expected = `
  "context"
  "github.com/ThreeDotsLabs/watermill-amqp/pkg/amqp"
    `
    const doc = await parser.parse(docWithAMQPSubscriber)
    const result = Imports(doc.channels())
    expect(result.trim()).toEqual(expected.trim())
  })
})
