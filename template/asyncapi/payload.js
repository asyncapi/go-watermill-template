const {GoGenerator} = require('@asyncapi/modelina');
const { File } = require('@asyncapi/generator-react-sdk');

export default async function({ asyncapi }) {
  const generator = new GoGenerator({ presets: [
    {
      struct: {
        field({ fieldName, field, renderer, type }) {
          const formattedFieldName = renderer.nameField(fieldName, field);
          const fieldType = renderer.renderType(field);
          return `${ formattedFieldName } ${ fieldType } \`json:"${ fieldName }"\``;
        },
      }
    }
  ] });
  const models = await generator.generate(asyncapi);

  let payloadContent = 'package asyncapi';
  models.forEach(model => {
    payloadContent += `
    ${model.dependencies.join('\n')}
    ${model.result}
    `;
  });

  return (
    <File name="payloads.go">
      {payloadContent}
    </File>
  );
}
