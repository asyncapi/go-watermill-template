{%- if params.modulePath -%}
module {{params.modulePath}}
{%- else %}
module asyncapi
{% endif %}

{%- if params.goVersion %}
go {{params.goVersion}}
{%- else %}
go 1.15
{%- endif -%}
