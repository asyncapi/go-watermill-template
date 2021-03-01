{%- from "../../partials/go.template" import messageName -%}
package operation


import (
	"asyncapi/channel"
	"asyncapi/message"
)

// operation.Handlers serve as an extensible pattern for defining how 
// to handle incoming async messages from subscriptions to channels

{%- for ch_name, ch in asyncapi.channels() -%}
	{#- Handlers are only needed for incoming messages -#}
	{%- if ch.hasSubscribe()  -%}
		{# These vars are effectively global to this file #}
		{%- set opName = ch.subscribe().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.subscribe().message()) %}

// {{ msgName -}}Handler defines how to handle an incoming {{msgName}} message.
type {{ msgName }}Handler func(params channel.{{ opName }}Params, msg message.{{msgName}})

	{%- endif -%}	
{% endfor -%}