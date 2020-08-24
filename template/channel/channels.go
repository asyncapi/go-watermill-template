{%- from "../../partials/go.template" import messageName -%}
package channel

// Publish Operation Topics
const(
	{%- for ch_name, ch in asyncapi.channels() -%}
		{%- if ch.hasPublish()  -%}
			{%- set opName = ch.publish().id() | toGoPublicID -%}
			{%- set msgName = messageName(ch.publish().message()) %}
	// Publish{{opName}} is the channel used for the {{opName}} operation
	Publish{{opName}} = "{{ch_name}}"

		{%- endif -%}
	{% endfor %}
)

// Subscribe Operation Topics
const(
	{%- for ch_name, ch in asyncapi.channels() -%}
		{%- if ch.hasSubscribe()  -%}
			{%- set opName = ch.subscribe().id() | toGoPublicID -%}
			{%- set msgName = messageName(ch.subscribe().message()) %}
	// Subscribe{{opName}} is the channel used for the {{opName}} operation
	Subscribe{{opName}} = "{{ch_name}}"

		{%- endif -%}
	{% endfor %}
)