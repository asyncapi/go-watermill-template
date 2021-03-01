{%- from "../../partials/go.template" import defineGoType -%}
{%- from "../../partials/go.template" import getGoType -%}
{%- set modelName = schema.uid() | toGoPublicID -%}
package model

// {{ modelName }} is a Schema defined in the AsyncAPI specification
// TODO: Support custom tags
type {{ modelName }} {{ defineGoType(schema, "json") }}

func New{{ modelName }}(
{%- set counter = 0 %}
{%- for propertyName, property in schema.properties() %}
    {%- if schema.required() | includes(propertyName) -%}
        {{ propertyName | toGoPrivateID }} {{ getGoType(property)  -}}
        {{schema.properties().length}}
        {%- if counter + 4 < schema.properties() | length %}, {% endif %}
    {%- set counter = counter + 1 %}
    {%- endif %}
{%- endfor %}) *{{ modelName }} {

    return new({{ modelName }})
}