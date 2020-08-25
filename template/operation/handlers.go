{%- from "../../partials/go.template" import messageName -%}
package operation

// operation.Handlers serve as an extensible pattern for defining how 
// to handle incoming async messages 

{% for ch_name, ch in asyncapi.channels() -%}
	{%- if ch.hasSubscribe()  -%}
		{# These vars are effectively global to this file #}
		{%- set opName = ch.subscribe().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.subscribe().message()) -%}
	{%- else  -%}
		{# These vars are effectively global to this file #}
		{%- set opName = ch.publish().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.publish().message()) -%}
	{%- endif %}

{#- TODO:: How to avoid duplicating message handler identifiers? -#}
// {{ msgName -}}Handler defines how to handle an incoming {{msgName}} message.
type func {{ msgName }}Handler(params channel.{{ opName }}Params, msg message.{{msgName}})	

{% endfor -%}