package channel

// ReceiveLightMeasurementParams holds the channel parameters used by the ReceiveLightMeasurement operation
type ReceiveLightMeasurementParams struct {
	// StreetlightId is the ID of the streetlight.
	StreetlightId string
}

// TurnOnParams holds the channel parameters used by the TurnOn operation
type TurnOnParams struct {
	// StreetlightId is the ID of the streetlight.
	StreetlightId string
}

// TurnOffParams holds the channel parameters used by the TurnOff operation
type TurnOffParams struct {
	// StreetlightId is the ID of the streetlight.
	StreetlightId string
}

// DimLightParams holds the channel parameters used by the DimLight operation
type DimLightParams struct {
	// StreetlightId is the ID of the streetlight.
	StreetlightId string
}