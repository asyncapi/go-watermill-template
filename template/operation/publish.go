{%- from "../../partials/go.template" import messageName -%}
package operation

import (
	"asyncapi/channel"
	"asyncapi/message"
)

type Producer interface {

{%- for ch_name, ch in asyncapi.channels() -%}
	{%- if ch.hasPublish()  -%}
		{%- set opName = ch.publish().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.publish().message()) %}

	// {{opName}} publishes a {{msgName}} message using the params provided 
	// in the param.{{opName}}Params. It is bound to the following channel:
	//
	// PUBLISH: {{ch_name}} 
	{{ ch.publish().id() | toGoPublicID }}(params channel.{{opName}}Params, msg message.{{msgName}})

	{%- endif -%}
{% endfor %}
}