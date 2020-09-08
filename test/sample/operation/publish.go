package operation

type Producer interface {

	// TurnOn publishes a TurnOnOff message using the params provided 
	// in the param.TurnOnParams. It is bound to the following channel:
	//
	// PUBLISH: smartylighting/streetlights/1/0/action/{streetlightId}/turn/on 
	func TurnOn(params channel.TurnOnParams, msg message.TurnOnOff)

	// TurnOff publishes a TurnOnOff message using the params provided 
	// in the param.TurnOffParams. It is bound to the following channel:
	//
	// PUBLISH: smartylighting/streetlights/1/0/action/{streetlightId}/turn/off 
	func TurnOff(params channel.TurnOffParams, msg message.TurnOnOff)

	// DimLight publishes a DimLight message using the params provided 
	// in the param.DimLightParams. It is bound to the following channel:
	//
	// PUBLISH: smartylighting/streetlights/1/0/action/{streetlightId}/dim 
	func DimLight(params channel.DimLightParams, msg message.DimLight)
}