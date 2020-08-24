{%- from "../../partials/go.template" import defineGoType -%}
{%- from "../../partials/go.template" import getGoType -%}
{%- set modelName = schema.uid() | toGoPublicID -%}
package model

// {{ modelName }} is a Schema defined in the AsyncAPI specification
type {{ modelName }} {{ defineGoType(schema) }}

func New{{ modelName }}(
{%- set counter = 0 %}
{%- for propertyName, property in schema.properties() %}
    {%- if schema.required() | includes(propertyName) -%}
        {{ propertyName }} {{ getGoType(property)  }}
        {% if counter != schema.properties().length %}, {% endif %}
    {%- set counter = counter +1 %}
    {%- endif %}
{%- endfor %}) *{{ modelName }} {

{%- for propertyName, property in schema.properties() %}
    {%- if property.required()%}
        this.{{ propertyName }}={{ propertyName }};
    {%- endif %}
{%- endfor %}
}