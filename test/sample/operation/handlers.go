package operation

// operation.Handlers serve as an extensible pattern for defining how 
// to handle incoming async messages 

// LightMeasuredHandler defines how to handle an incoming LightMeasured message.
type func LightMeasuredHandler(params channel.ReceiveLightMeasurementParams, msg message.LightMeasured)	

// TurnOnOffHandler defines how to handle an incoming TurnOnOff message.
type func TurnOnOffHandler(params channel.TurnOnParams, msg message.TurnOnOff)	

// TurnOnOffHandler defines how to handle an incoming TurnOnOff message.
type func TurnOnOffHandler(params channel.TurnOffParams, msg message.TurnOnOff)	

// DimLightHandler defines how to handle an incoming DimLight message.
type func DimLightHandler(params channel.DimLightParams, msg message.DimLight)	

