package channel

import (
	"strings"
)

// Publish Operation Topics

// Build uses TurnOnParams to build the channel required for TurnOn operations
func (params TurnOnParams) Build() string {
	const ch string = "smartylighting/streetlights/1/0/action/{streetlightId}/turn/on"
	r := strings.NewReplacer("{streetlightId}",params.StreetlightId)

	return r.Replace(ch)
}

// Build uses TurnOffParams to build the channel required for TurnOff operations
func (params TurnOffParams) Build() string {
	const ch string = "smartylighting/streetlights/1/0/action/{streetlightId}/turn/off"
	r := strings.NewReplacer("{streetlightId}",params.StreetlightId)

	return r.Replace(ch)
}

// Build uses DimLightParams to build the channel required for DimLight operations
func (params DimLightParams) Build() string {
	const ch string = "smartylighting/streetlights/1/0/action/{streetlightId}/dim"
	r := strings.NewReplacer("{streetlightId}",params.StreetlightId)

	return r.Replace(ch)
}
