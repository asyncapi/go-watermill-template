{%- from "../../partials/go.template" import getGoType -%}
{%- from "../../partials/go.template" import messageName -%}
{%- from "../../partials/go.template" import defineOperationParams -%}
package channel

{%- for ch_name, ch in asyncapi.channels() %}
{% if ch.hasPublish()  -%}
	{{ defineOperationParams(ch.publish(), ch.parameters()) }}
{%- endif -%}
{%- if ch.hasSubscribe()  -%}
	{{ defineOperationParams(ch.subscribe(), ch.parameters()) }}
{%- endif -%}
{% endfor %}