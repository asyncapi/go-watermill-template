const { File } = require('@asyncapi/generator-react-sdk');
import { Handlers } from '../../components/Handlers';

export default async function({ asyncapi, params }) {
  //if there are no channels, handlers need not be created
  if ( asyncapi.channels().length === 0) {
    return
  }
  
  return (
    <File name="handlers.go">
       <Handlers moduleName={params.moduleName} channels={asyncapi.channels()} />    
    </File>
  );
}