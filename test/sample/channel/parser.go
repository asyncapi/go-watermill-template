package channel

import (
	"regexp"
	"errors"
)

// Subscribe Operation Topics
var (
	// SubscribeReceiveLightMeasurement is a regex expression to match the parameters in the ReceiveLightMeasurement subscribe operation's channel
	SubscribeReceiveLightMeasurementRegex = regexp.MustCompile("smartylighting/streetlights/1/0/event/(.+)/lighting/measured")
)

// Parse populates the fields of a ReceiveLightMeasurementParams instance with values 
// extracted from a channel
func (params *ReceiveLightMeasurementParams) Parse(ch string) error {
	match := SubscribeReceiveLightMeasurementRegex.FindStringSubmatch(ch)
	if len(match) < 2 {
		return errors.New("channel did not match expected format: " + ch)
	}

	// Map the struct fields to the order they will appear in the topic
	fields := []*string{&params.StreetlightId}

	for i, field := range fields {
		// Populate params fields - skipping the first index of 'match' as 
		// captured groups start at index=1
		*field = match[i+1]
	}

	return nil
}