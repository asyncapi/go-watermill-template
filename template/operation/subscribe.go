{%- from "../../partials/go.template" import messageName -%}
package operation

type Consumer interface {

{%- for ch_name, ch in asyncapi.channels() -%}
	{%- if ch.hasSubscribe()  -%}
		{%- set opName = ch.subscribe().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.subscribe().message()) %}

	// {{opName}} subscribes to {{msgName}} messages using the params provided
	// in the param.{{opName}}Params. It is bound to the following channel:
	//
	// SUBSCRIBE: {{ch_name}} 
	func {{ ch.subscribe().id() | toGoPublicID }}(params param.{{opName}}Params, msg message.{{msgName}})

	{%- endif -%}
{% endfor %}
}