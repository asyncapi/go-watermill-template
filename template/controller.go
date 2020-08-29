{%- from "../partials/go.template" import messageName -%}
{%- from "../partials/go.template" import getOpBinding -%}
package asyncapi

import "transport"

type Controller {
	Transport transport.PubSub

	contentWriters map[string]content.Writer
	contentReaders map[string]content.Reader
}

{% for ch_name, ch in asyncapi.channels() -%}
	{%- if ch.hasPublish()  -%}
		{# These vars are effectively global to this file #}
		{%- set opName = ch.publish().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.publish().message()) -%}

// {{ ch.publish().id() | toGoPublicID }} implements operation.Producer
func (c Controller) {{ ch.publish().id() | toGoPublicID }}(params channel.{{opName}}Params, msg message.{{msgName}}) error {
	// Define any operation bindings. These are constant per operation
	{%- set bindingList = "" -%}
	{%- set counter = 0 -%}
	{%- for protocol, binding in  ch.publish().bindings() -%}
		{{ getOpBinding(protocol, binding) }}

		{#- Append bindings variable name to a string of operation bindings (used in Subscribe below) -#}
		{%- if counter  < ch.publish().bindings() | length  -%}
			{%- set bindingList = bindingList + ", " -%}
		{% endif -%}
		{%- set bindingList = bindingList + protocol + "Bindings" -%}
		{%- set counter = counter + 1 %}
	{%- endfor %}

	// Throw error for missing content type encoder
	w := c.getWriter(msg.ContentType)
	if w == nil {
		return errors.New("no message writer is registered for content type: " + msg.ContentType)
	}

	// Throw error if failed to encode payload
	if msg.RawPayload, err := w.Write(msg.Payload) {
		return err
	}

	// Publish the underlying transport.Message with the transport layer
	return c.Transport.Publish(params.Build(), mag.Message{{bindingList}})
}

	{% else  -%}
		{# These vars are effectively global to this file #}
		{%- set opName = ch.subscribe().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.subscribe().message()) -%}

// {{ ch.subscribe().id() | toGoPublicID }} implements operation.Consumer
func (c Controller) {{ ch.subscribe().id() | toGoPublicID }}(params channel.{{opName}}Params, fn {{msgName}}Handler) error {
	// Define any operation bindings. These are constant per operation
	{%- set bindingList = "" -%}
	{%- set counter = 0 -%}
	{%- for protocol, binding in  ch.subscribe().bindings() -%}
		{{ getOpBinding(protocol, binding) }}

		{#- Append bindings variable name to a string of operation bindings (used in Subscribe below) -#}
		{%- if counter < ch.subscribe().bindings() | length  -%}
			{%- set bindingList = bindingList + ", " -%}
		{% endif -%}
		{%- set bindingList = bindingList + protocol + "Bindings" -%}
		{%- set counter = counter + 1 %}
	{%- endfor %}

	// Throw error before subscribing if expected content type reader is not registered
	r := c.getReader(msg.ContentType)
	if r == nil {
		return errors.New("no message writer is registered for content type: " + msg.ContentType)
	}

	// Subscribe with the transport layer. Wrap message handler /w logic to decode 
	// transport.Message payload into {{msgName}} message
	c.Transport.Subscribe(ch, func(topic, buf{{bindingList}})) {
		// Init a new message object & attempt to use the defined content.Reader to parse
		// the message payload
		msg := message.New{{msgName}}()
		if err := r.Read(buf, &msg.Payload); err != nil {
			return error
		}

		// Parse the params out of the channel
		recParams := &channel.{{opName}}Params{}
		if err := recParams.Parse(ch); err != nil {
			return err
		}

		// Call the operation's message handler
		fn(recParams, msg)
	})
}

	{% endif %}
{% endfor -%}