package model

// DimLightPayload is a Schema defined in the AsyncAPI specification
// TODO: Support custom tags
type DimLightPayload struct {
    // Percentage is a property defined in the AsyncAPI specification
    Percentage *int64 `json:"percentage"`

    // SentAt is a property defined in the AsyncAPI specification
    SentAt *SentAt `json:"sentAt"`
}

func NewDimLightPayload() *DimLightPayload {

    return new(DimLightPayload)
}