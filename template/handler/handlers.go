{%- from "../../partials/go.template" import messageName -%}

package handler

{% for ch_name, ch in asyncapi.channels() -%}
	// {{ch_name}} 
{% if ch.hasPublish()  -%}
		{%- set msgName = messageName(ch.publish().message()) -%}
		type func {{ ch.publish().id() | toGoPublicID }}(msg {{msgName}})
	{%- endif %}

{%- if ch.hasSubscribe()  -%}
		{%- set msgName = messageName(ch.subscribe().message()) -%}
		type func {{ ch.subscribe().id() | toGoPublicID }}(msg {{msgName}})
	{%- endif %}

{% endfor -%}