const {GoGenerator} = require('@asyncapi/modelina');
const { File } = require('@asyncapi/generator-react-sdk');

export default async function({ asyncapi }) {
  const generator = new GoGenerator({ presets: [
    {
      struct: {
        field({ field }) {
          return `${ field.propertyName } ${ field.property.type } \`json:"${ field.unconstrainedPropertyName }"\``;
        },
      }
    }
  ] });
  const models = await generator.generate(asyncapi);

  let payloadContent = `
  package asyncapi

  import (
    "encoding/json"

    "github.com/ThreeDotsLabs/watermill/message"
  )
  `;

  const payloadUtils = `

// PayloadToMessage converts a payload to watermill message
func PayloadToMessage(i interface{}) (*message.Message, error) {
  var m message.Message

  b, err := json.Marshal(i)
  if err != nil {
    return nil, nil
  }
  m.Payload = b

  return &m, nil
}
  `;

  models.forEach(model => {
    payloadContent += `
    ${model.dependencies.join('\n')}
    ${model.result}
    `;
  });

  payloadContent += payloadUtils;

  return (
    <File name="payloads.go">
      {payloadContent}
    </File>
  );
}
