const _ = require('lodash');

/**
 * AsyncAPI v3 Compatibility Layer
 * These functions provide backward compatibility between AsyncAPI v2 and v3 specs
 */

/**
 * Detects the AsyncAPI version
 * @param {Object} asyncapi - Parsed AsyncAPI document
 * @returns {number} - Major version number (2 or 3)
 */
export function getAsyncAPIVersion(asyncapi) {
  const version = asyncapi.version();
  return parseInt(version.split('.')[0], 10);
}

/**
 * Checks if a channel has a publish operation (v2) or receive action (v3)
 * In v2: channel.hasPublish() means the application receives messages
 * In v3: operations with action='receive' mean the application receives messages
 * @param {Object} channel - Channel object
 * @param {Object} asyncapi - AsyncAPI document
 * @returns {boolean}
 */
export function hasPublishCompat(channel, asyncapi) {
  const version = getAsyncAPIVersion(asyncapi);

  if (version === 2) {
    return channel.hasPublish();
  }

  // v3: Check if any operation references this channel with action='receive'
  if (asyncapi.operations && typeof asyncapi.operations === 'function') {
    const operations = asyncapi.operations();
    return Object.values(operations).some(operation => {
      if (operation.action && operation.action() === 'receive') {
        const opChannels = operation.channels ? operation.channels() : [];
        return opChannels.some(opChannel => opChannel.id() === channel.id());
      }
      return false;
    });
  }

  return false;
}

/**
 * Checks if a channel has a subscribe operation (v2) or send action (v3)
 * In v2: channel.hasSubscribe() means the application sends messages
 * In v3: operations with action='send' mean the application sends messages
 * @param {Object} channel - Channel object
 * @param {Object} asyncapi - AsyncAPI document
 * @returns {boolean}
 */
export function hasSubscribeCompat(channel, asyncapi) {
  const version = getAsyncAPIVersion(asyncapi);

  if (version === 2) {
    return channel.hasSubscribe();
  }

  // v3: Check if any operation references this channel with action='send'
  if (asyncapi.operations && typeof asyncapi.operations === 'function') {
    const operations = asyncapi.operations();
    return Object.values(operations).some(operation => {
      if (operation.action && operation.action() === 'send') {
        const opChannels = operation.channels ? operation.channels() : [];
        return opChannels.some(opChannel => opChannel.id() === channel.id());
      }
      return false;
    });
  }

  return false;
}

/**
 * Gets the publish operation for a channel (compatible with v2 and v3)
 * @param {Object} channel - Channel object
 * @param {Object} asyncapi - AsyncAPI document
 * @returns {Object|null} - Operation object or null
 */
export function getPublishOperationCompat(channel, asyncapi) {
  const version = getAsyncAPIVersion(asyncapi);

  if (version === 2) {
    return channel.hasPublish() ? channel.publish() : null;
  }

  // v3: Find operation with action='receive' that references this channel
  if (asyncapi.operations && typeof asyncapi.operations === 'function') {
    const operations = asyncapi.operations();
    for (const operation of Object.values(operations)) {
      if (operation.action && operation.action() === 'receive') {
        const opChannels = operation.channels ? operation.channels() : [];
        if (opChannels.some(opChannel => opChannel.id() === channel.id())) {
          return operation;
        }
      }
    }
  }

  return null;
}

/**
 * Gets the subscribe operation for a channel (compatible with v2 and v3)
 * @param {Object} channel - Channel object
 * @param {Object} asyncapi - AsyncAPI document
 * @returns {Object|null} - Operation object or null
 */
export function getSubscribeOperationCompat(channel, asyncapi) {
  const version = getAsyncAPIVersion(asyncapi);

  if (version === 2) {
    return channel.hasSubscribe() ? channel.subscribe() : null;
  }

  // v3: Find operation with action='send' that references this channel
  if (asyncapi.operations && typeof asyncapi.operations === 'function') {
    const operations = asyncapi.operations();
    for (const operation of Object.values(operations)) {
      if (operation.action && operation.action() === 'send') {
        const opChannels = operation.channels ? operation.channels() : [];
        if (opChannels.some(opChannel => opChannel.id() === channel.id())) {
          return operation;
        }
      }
    }
  }

  return null;
}

/**
 * Input: parsed asyncapi object
 * Output: object which indicates what protocols are present in the async api document
 * Curently supports AMQP alone
 * Example Output:
 * {
 *   "hasAMQP": true
 * }
 */
export function GetProtocolFlags(asyncapi) {
  const protocolFlags = {
    hasAMQP: false
  };

  const channelEntries = Object.keys(asyncapi.channels()).length ? Object.entries(asyncapi.channels()) : [];
  //if there are no channels do nothing
  if (channelEntries.length === 0) {
    return protocolFlags;
  }

  //if there are no amqp publisher or subscribers do nothing
  // Note: We check for bindings first, then operations (to match original behavior)
  // Original code had a bug: channel.hasSubscribe without () always returned truthy
  // This meant any channel with AMQP bindings would return true
  const hasAMQP = channelEntries.filter(([channelName, channel]) => {
    // Check if channel has AMQP bindings
    if (!channel.bindings() || !channel.bindings().amqp) {
      return false;
    }
    // If it has bindings, check if it has any operations (or just bindings for v2 compatibility)
    return hasPublishCompat(channel, asyncapi) || hasSubscribeCompat(channel, asyncapi) || true;
  }).length > 0;

  protocolFlags.hasAMQP = hasAMQP;

  return protocolFlags;
}

/**
 * Input: parsed asyncapi object
 * Output: object which indicates what protocols have subscribers
 * Curently supports AMQP alone
 * Example Output:
 * {
 *   "hasAMQPSub": true
 * }
 */
export function GetSubscriberFlags(asyncapi) {
  const subscriberFlags = {
    hasAMQPSub: false
  };

  const channelEntries = Object.keys(asyncapi.channels()).length ? Object.entries(asyncapi.channels()) : [];
  //if there are no channels do nothing
  if (channelEntries.length === 0) {
    return subscriberFlags;
  }

  //if there are no amqp publisher or subscribers do nothing
  const hasAMQPSub = channelEntries.filter(([channelName, channel]) => {
    return hasPublishCompat(channel, asyncapi) && channel.bindings().amqp;
  }).length > 0;

  subscriberFlags.hasAMQPSub = hasAMQPSub;

  return subscriberFlags;
}

/**
 * Input: parsed asyncapi object
 * Output: object which indicates what protocols have publishers
 * Curently supports AMQP alone
 * Example Output:
 * {
 *   "hasAMQPPub": true
 * }
 */
export function GetPublisherFlags(asyncapi) {
  const publisherFlags = {
    hasAMQPPub: false
  };

  const channelEntries = Object.keys(asyncapi.channels()).length ? Object.entries(asyncapi.channels()) : [];
  //if there are no channels do nothing
  if (channelEntries.length === 0) {
    return publisherFlags;
  }

  //if there are no amqp publisher or subscribers do nothing
  const hasAMQPPub = channelEntries.filter(([channelName, channel]) => {
    return hasSubscribeCompat(channel, asyncapi) && channel.bindings().amqp;
  }).length > 0;

  publisherFlags.hasAMQPPub = hasAMQPPub;

  return publisherFlags;
}

export function hasPubOrSub(asyncapi) {
  return hasPub(asyncapi) || hasSub(asyncapi);
}

export function hasSub(asyncapi) {
  const subscriberFlags = GetSubscriberFlags(asyncapi);
  for (const protocol in subscriberFlags) {
    if (subscriberFlags[`${protocol}`] === true) {
      return true;
    }
  }
  return false;
}

export function hasPub(asyncapi) {
  const publisherFlags = GetPublisherFlags(asyncapi);
  for (const protocol in publisherFlags) {
    if (publisherFlags[`${protocol}`] === true) {
      return true;
    }
  }
  return false;
}

export function pascalCase(string) {
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}
