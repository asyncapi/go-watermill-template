package operation

{% if channel.hasPublish()  -%}
{%- set msgName = (channel.publish().message().name() | toGoPublicID) if channel.publish().message().name() else (message.uid() | toGoPublicID) -%}
type func {{ channel.publish().id() | toGoPublicID }}(msg {{msgName}})
{%- endif %}

{%- if channel.hasSubscribe()  -%}
type func {{ channel.subscribe().id() | toGoPublicID }}(msg {{msgName}})
{%- endif -%}