import { GetProtocolFlags, GetPublisherFlags, GetSubscriberFlags, pascalCase, hasPubOrSub } from '../../components/common';
import parser from '@asyncapi/parser'
import fs from 'fs'
import path from 'path'

const docWithoutProtocols = fs.readFileSync(path.resolve(__dirname, '../files/docWithoutProtocols.yml'), 'utf8');
const docWithAMQPublisher = fs.readFileSync(path.resolve(__dirname, '../files/docWithAMQPublisher.yml'), 'utf8');
const docWithAMQPSubscriber = fs.readFileSync(path.resolve(__dirname, '../files/docWithAMQPSubscriber.yml'), 'utf8');
const docWithoutAMQPublisher = fs.readFileSync(path.resolve(__dirname, '../files/docWithoutAMQPublisher.yml'), 'utf8');

describe('GetProtocolFlags', () => {

  it('should return protocols as false when no channels are present ', async function() {
    const expected = {
      hasAMQP: false
    };

    const doc = await parser.parse(docWithoutProtocols);
    const result = GetProtocolFlags(doc);
    expect(result).toEqual(expected);
  })

  it('should return amqp as true when channels with amqp bindings are present ', async function() {
    const expected = {
      hasAMQP: true
    };

    const doc = await parser.parse(docWithoutAMQPublisher);
    const result = GetProtocolFlags(doc);
    expect(result).toEqual(expected);
  })

})

describe('GetSubscriberFlags', () => {
  it('should return subscriberFlags as false when no channels are present ', async function() {
    const expected = {
      hasAMQPSub: false
    };

    const doc = await parser.parse(docWithoutProtocols);
    const result = GetSubscriberFlags(doc);
    expect(result).toEqual(expected);
  })

  it('should return subscriberFlags as false when publish channels are NOT present', async function() {
    const expected = {
      hasAMQPSub: false
    };
    const doc = await parser.parse(docWithoutAMQPublisher);
    const result = GetSubscriberFlags(doc);
    expect(result).toEqual(expected);
  })

  it('should return subscriberFlags as true when publish channels are present', async function() {
    const expected = {
      hasAMQPSub: true
    };
    const doc = await parser.parse(docWithAMQPublisher);
    const result = GetSubscriberFlags(doc);
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

describe('GetPublisherFlags', () => {

  it('should return publisherFlags as false when no channels are present ', async function() {
    const expected = {
      hasAMQPPub: false
    };

    const doc = await parser.parse(docWithoutProtocols);
    const result = GetPublisherFlags(doc);
    expect(result).toEqual(expected);
  })

  it('should return publisherFlags as true when subscribe channels are present', async function() {
    const expected = {
      hasAMQPPub: true
    };
    const doc = await parser.parse(docWithAMQPSubscriber);
    const result = GetPublisherFlags(doc);
    expect(result).toEqual(expected);
  })
})

describe('hasPubOrSub', () => {

  it('should return false when no channels are present ', async function() {
    const expected = false
    const doc = await parser.parse(docWithoutProtocols);
    const result = hasPubOrSub(doc);
    expect(result).toEqual(expected);
  })

  it('should return true when subscribers are present ', async function() {
    const expected = true
    const doc = await parser.parse(docWithAMQPSubscriber);
    const result = hasPubOrSub(doc);
    expect(result).toEqual(expected);
  })

  it('should return true when publishers are present', async function() {
    const expected = true
    const doc = await parser.parse(docWithAMQPublisher);
    const result = hasPubOrSub(doc);
    expect(result).toEqual(expected);
  })
})
