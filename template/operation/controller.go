{%- from "../../partials/go.template" import messageName -%}
{%- from "../../partials/go.template" import getOpBinding -%}
package asyncapi

type Controller {
	async transport.PubSub

	contentWriters map[string]content.Writer
	contentReaders map[string]content.Reader
}

{% for ch_name, ch in asyncapi.channels() -%}
	{%- if ch.hasPublish()  -%}
		{# These vars are effectively global to this file #}
		{%- set opName = ch.publish().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.publish().message()) -%}

// {{ ch.publish().id() | toGoPublicID }} implements operation.Producer
func (c Controller) {{ ch.publish().id() | toGoPublicID }}(params channel.{{opName}}Params, msg message.{{msgName}}) {
	// Define any operation bindings. These are constant per operation
	{%- for protocol, binding in  ch.publish().bindings() -%}
		{{ getOpBinding(protocol, binding) }}
	{%- endfor %}

	// Handle no writer? Throw error
	w := c.getWriter(msg.ContentType)
	buf := w.Write(msg.Payload)
	ch := channel.Publish{{opName}}.Build(params)

	c.async.Publish(ch, b, bindingMQTT5, bindingMQTT5)
}

	{% else  -%}
		{# These vars are effectively global to this file #}
		{%- set opName = ch.subscribe().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.subscribe().message()) -%}

// {{ ch.subscribe().id() | toGoPublicID }} implements operation.Consumer
func (c Controller) {{ ch.subscribe().id() | toGoPublicID }}(params channel.{{opName}}Params, fn {{msgName}}Handler) {
	// Define any operation bindings. These are constant per operation
	{%- for protocol, binding in  ch.subscribe().bindings() -%}
		{{ getOpBinding(protocol, binding) }}
	{%- endfor %}

	// Handle no reader? Throw error
	r := c.getReader(msg.ContentType)
	c.async.Subscribe(ch, func(topic, buf, {bindings})) {
		// Init a new message object & attempt to use the defined content.Reader to parse
		// the message payload
		msg := message.New{{msgName}}()
		if err := r.Read(buf, &msg.Payload); err != nil {
			// TODO: Handle error
		}

		// Parse the params out of the channel
		recParams := channel.Subscribe{{opName}}.Parse(ch)

		// Call the operation's message handler
		fn(recParams, msg)
	})
}

	{% endif %}
{% endfor -%}