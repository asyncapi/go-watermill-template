{%- from "../../partials/go.template" import messageName -%}
package channel

// Publish Operation Topics
{%- for ch_name, ch in asyncapi.channels() -%}
	{%- if ch.hasPublish()  -%}
		{%- set opName = ch.publish().id() | toGoPublicID -%}
		{%- set msgName = messageName(ch.publish().message()) %}

// Build uses {{opName}}Params to build the channel required for {{opName}} operations
func (params {{opName}}Params) Build() string {
	const ch string = "{{ ch_name }}"
	r := strings.NewReplacer(
	
	{%- set ordered_params = ch_name | orderedParamNames -%}
	{%- set counter = 0 -%}

	{%- for param_name in ordered_params -%}
		"{{param_name}}",params.{{ param_name | toGoPublicID }}
		{%- if counter + 1 < ordered_params | length  %},{% endif -%}
		{%- set counter = counter + 1 %}
	{%- endfor -%}
	)

	return r.Replace(ch)
}
	{%- endif -%}
{% endfor %}
