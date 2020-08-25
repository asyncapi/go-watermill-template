package operation

{% for ch_name, ch in asyncapi.channels() -%}
	{%- if ch.hasSubscribe()  -%}
		{%- set opName = ch.subscribe().id() | toGoPublicID -%}	

{% if ch.subscribe().binding("mqtt5") %}
{%- set bindings = ch.subscribe().binding("mqtt5") %}
// {{ opName }}MQTT5 defines the MQTT5 operation bindings for {{ opName }}
var {{ opName }}Mqtt5 = binding.MQTT5 {
	{%- if bindings.qos %}
	QoS:            {{ bindings.qos }},
	{%- endif %}
	{% if bindings.retain -%}
	Retain:         {{ bindings.retain }},
	{%- endif %}
	{% if bindings.bindingVersion -%}
	BindingVersion: "{{ bindings.bindingVersion }}",
	{%- endif %}
}
{% endif -%}

{% if ch.subscribe().binding("kafka") %}
{%- set bindings = ch.subscribe().binding("kafka") %}
// {{ opName }}Kafka defines the Kafka operation bindings for {{ opName }}
var {{ opName }}Kafka = binding.Kafka {
	{%- if bindings.groupId %}
	GroupID:        "{{ bindings.groupId }}",
	{%- endif %}
	{% if bindings.clientId -%}
	ClientID:       "{{ bindings.clientId }}",
	{%- endif %}
	{% if bindings.bindingVersion -%}
	BindingVersion: "{{ bindings.bindingVersion }}",
	{%- endif %}
}
{% endif -%}

	{% endif %}
{%- endfor-%}