# AsyncAPI To-Go! :package: 

Do you bang your head against the wall writing event driven microservices?  
Well now you you can bang your head faster!

To-Go helps produce the code behind your event-driven operations by transforming AsyncAPI specs **To Go**

## What is it?
AsyncAPI To-Go is a code generation template for the [AsyncAPI generator](https://github.com/asyncapi/generator) that can be used to generate boilerplate Go code for interacting with event-driven architectures. 

The generator consumes an [**AsyncAPI 2.0**](https://www.asyncapi.com/docs/specifications/2.0.0/) YAML or JSON specification file and uses this template to produce matching channel constants, message payload structs, and (W.I.P.) ~~optionally, logic to wrap it into a lightweight library.~~ The underlying transport layer interface enables pluggable support for most messaging system (Kafka, MQTT, AMPQ, etc.).

The template provides switches to allow for different levels of generation. More information can be found at [generation levels](#generation-levels)
* Channel parsing / generation with parameter structs
* Schema and Message definitions
* ~~Content Type parsing with the ability to extend supported content types~~ (Soon)
* A transport interface to support various underlying event messaging protocols
* ~~A simple wrapping framework to provide AsyncAPI *operations* as high-level functions~~ (Very Soon)

## What Am I Getting Myself Into? 
Code Samples:

Channel Building / Parsing
 ```
 code snippets
 ```

## Getting Started

### Dependencies:
The AsyncAPI Generation tool is required to execute this template. Find it here : https://github.com/asyncapi/generator/#install-the-cli.

1. Install AsyncAPI Generation tool
	```bash
	$ npm install -g @asyncapi/generator
	```
2. Clone the template to wherever you like
	```bash
	$ cd ~/dev/tools/
	$ git clone https://github.com/jposton96a/to-go.git
	```
3. Run the generator.  
	Args in order:
	* The path to your Async specification file
	* The path to the template folder of this directory
	* Destination directory for output
	```
	$ ag ./asyncapi.yaml ~/dev/tools/to-go/template -o ./<dest-dir>
	```

## What does the generation look like? 
Examples based on the Streetlights example specification

#### Message Sample
```golang
//   Location: message/<msg_name/id>.go


// DimLight is used to command a particular streetlight to dim the lights.
type DimLight struct {
	transport.Message

	// ContentType indicates the specified MIME type for this message. If empty, the defaultContentType should be used 
	ContentType string
	
	// Payload contains the content defined by the payload AsyncAPI field
	Payload model.DimLightPayload
}
```
#### Schema Sample
```golang
//   Location: model/<schema_name>.go

// DimLightPayload is a Schema defined in the AsyncAPI specification
type DimLightPayload struct {
    // Percentage is a property defined in the AsyncAPI specification
    Percentage *int64 `json:"percentage"`

    // SentAt is a property defined in the AsyncAPI specification
    SentAt *SentAt `json:"sentAt"`
}


func NewDimLightPayload() *DimLightPayload {

    return &DimLightPayload{
    }
}
```
#### Channel Parameters Sample
```golang
//   definitions:   channel/parameters.go
//   builder funcs: channel/builder.go
//   parser funcs:  channel/parser.go

// TurnOnParams holds the channel parameters used by the TurnOn operation
type TurnOnParams = struct {
	// StreetlightId is the ID of the streetlight.
	StreetlightId string
}

// Parse populates the fields of a TestMyThingParams instance with values 
// extracted from a channel
func (params *TestMyThingParams) Parse(ch string) error {
	match := SubscribeTestMyThingRegex.FindStringSubmatch(ch)
	if len(match) < 2 {
		return errors.New("channel did not match expected format: " + ch)
	}

	// Map the struct fields to the order they will appear in the topic
	fields := []*string{&params.StreetlightId,&params.Action}

	for i, field := range fields {
		// Populate params fields - skipping the first index of 'match' as 
		// captured groups start at index=1
		*field = match[i+1]
	}

	return nil
}

// Build uses TurnOnParams to build the channel required for TurnOn operations
func (params TurnOnParams) Build() string {
	const ch string = "smartylighting/streetlights/1/0/action/{streetlightId}/turn/on"
	r := strings.NewReplacer("{streetlightId}",params.StreetlightId)

	return r.Replace(ch)
}

```
#### Controller Sample
```golang
//   Locations: controller.go

// TurnOff implements operation.Producer
func (c Controller) TurnOff(params channel.TurnOffParams, msg message.TurnOnOff) error {
	// Define any operation bindings. These are constant per operation
    var mqtt5Bindings = map[string]interface{} {"qos":1,"retain":true,"bindingVersion": "0.0.1",}

	// Throw error for missing content type encoder
	w := c.getWriter(msg.ContentType)
	if w == nil {
		return errors.New("no message writer is registered for content type: " + msg.ContentType)
	}

	// Throw error if failed to encode payload
	if msg.RawPayload, err := w.Write(msg.Payload) {
		return err
	}

	// Publish the underlying transport.Message with the transport layer
	return c.async.Publish(params.Build(), mag.Message, kafkaBindings)
}

```