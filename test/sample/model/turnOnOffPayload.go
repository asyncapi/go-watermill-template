package model

// TurnOnOffPayload is a Schema defined in the AsyncAPI specification
// TODO: Support custom tags
type TurnOnOffPayload struct {
    // Command is a property defined in the AsyncAPI specification
    Command *string `json:"command"`

    // SentAt is a property defined in the AsyncAPI specification
    SentAt *SentAt `json:"sentAt"`
}

func NewTurnOnOffPayload() *TurnOnOffPayload {

    return new(TurnOnOffPayload)
}