package operation

type Consumer interface {

	// ReceiveLightMeasurement subscribes to LightMeasured messages using the params provided
	// in the param.ReceiveLightMeasurementParams. It is bound to the following channel:
	//
	// SUBSCRIBE: smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured 
	func ReceiveLightMeasurement(params channel.ReceiveLightMeasurementParams, fn LightMeasuredHandler)
}