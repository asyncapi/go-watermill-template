package model

// LightMeasuredPayload is a Schema defined in the AsyncAPI specification
// TODO: Support custom tags
type LightMeasuredPayload struct {
    // Lumens is a property defined in the AsyncAPI specification
    Lumens *int64 `json:"lumens"`

    // SentAt is a property defined in the AsyncAPI specification
    SentAt *SentAt `json:"sentAt"`
}

func NewLightMeasuredPayload() *LightMeasuredPayload {

    return new(LightMeasuredPayload)
}