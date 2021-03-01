package channel

// Publish Operation Topics
const(
	// PublishTurnOn is the channel used for the TurnOn operation
	PublishTurnOn = "smartylighting/streetlights/1/0/action/{streetlightId}/turn/on"
	// PublishTurnOff is the channel used for the TurnOff operation
	PublishTurnOff = "smartylighting/streetlights/1/0/action/{streetlightId}/turn/off"
	// PublishDimLight is the channel used for the DimLight operation
	PublishDimLight = "smartylighting/streetlights/1/0/action/{streetlightId}/dim"
)

// Subscribe Operation Topics
const(
	// SubscribeReceiveLightMeasurement is the channel used for the ReceiveLightMeasurement operation
	SubscribeReceiveLightMeasurement = "smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured"
)