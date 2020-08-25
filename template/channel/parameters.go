{%- from "../../partials/go.template" import getGoType -%}
{%- from "../../partials/go.template" import messageName -%}
package channel

{%- for ch_name, ch in asyncapi.channels() -%}
{%- if ch.hasPublish()  -%}
	{%- set opName = ch.publish().id() | toGoPublicID -%}
	{%- set msgName = messageName(ch.publish().message()) %}

// {{opName}}Params holds the channel parameters used by the {{opName}} operation
type {{opName}}Params = struct {
	{% for param_name, param in ch.parameters() %}
	// {{ param_name | toGoPublicID }} is {{ param.description() | lowerFirst }}
	{{ param_name | toGoPublicID }} {{ getGoType(param.schema()) }}
	{% endfor %}
}

{%- endif -%}
{% endfor %}