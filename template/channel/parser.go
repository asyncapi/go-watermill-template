{%- from "../../partials/go.template" import messageName -%}
package channel

import (
	"regexp"
	"errors"
)

// Subscribe Operation Topics
var (
	{%- for ch_name, ch in asyncapi.channels() -%}
		{%- if ch.hasSubscribe()  -%}
			{%- set opName = ch.subscribe().id() | toGoPublicID -%}
			{%- set msgName = messageName(ch.subscribe().message()) %}
	// Subscribe{{opName}} is a regex expression to match the parameters in the {{opName}} subscribe operation's channel
	Subscribe{{opName}}Regex = regexp.MustCompile("{{ ch_name | toChannelRegex }}")

		{%- endif -%}
	{% endfor %}
)

{%- for ch_name, ch in asyncapi.channels() -%}
		{%- if ch.hasSubscribe()  -%}
			{%- set opName = ch.subscribe().id() | toGoPublicID -%}
			{%- set msgName = messageName(ch.subscribe().message()) %}

// Parse populates the fields of a {{opName}}Params instance with values 
// extracted from a channel
func (params *{{opName}}Params) Parse(ch string) error {
	match := Subscribe{{opName}}Regex.FindStringSubmatch(ch)
	if len(match) < 2 {
		return errors.New("channel did not match expected format: " + ch)
	}

	// Map the struct fields to the order they will appear in the topic
	fields := []*string{
	{%- set ordered_params = ch_name | orderedParamNames -%}
	{%- set counter = 0 -%}
	{%- for param_name in ordered_params -%}

	&params.{{ param_name | toGoPublicID }}
	
		{%- if counter + 1 < ordered_params | length  %},{% endif -%}
		{%- set counter = counter + 1 %}
	{%- endfor -%}
	}

	for i, field := range fields {
		// Populate params fields - skipping the first index of 'match' as 
		// captured groups start at index=1
		*field = match[i+1]
	}

	return nil
}

	{%- endif -%}
{% endfor %}