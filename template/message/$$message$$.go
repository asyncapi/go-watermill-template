{%- from "../../partials/go.template" import getGoType -%}
{%- from "../../partials/go.template" import defineGoType -%}
{%- from "../../partials/go.template" import messageName -%}
{%- set msgName = messageName(message) -%}
package message

import (
	"asyncapi/transport"
	"asyncapi/model"
)

// {{ msgName }} is used to {{message.summary() | lowerFirst}}
type {{ msgName }} struct {
	transport.Message

	// ContentType indicates the specified MIME type for this message. If empty, the defaultContentType should be used 
	ContentType string
	
	// Body contains the content defined by the payload AsyncAPI field
	Body model.{{ getGoType(message.payload()) }}
}

// New{{ msgName }} instantiates a new message with the provided context
func New{{ msgName }}(msg transport.Message) {{ msgName }} {
	return {{ msgName }} {
		Message: msg,
		ContentType: "{{ message.contentType() }}",
	}
}