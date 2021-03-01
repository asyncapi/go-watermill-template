package model

// SentAt is a Schema defined in the AsyncAPI specification
// TODO: Support custom tags
type SentAt string

func NewSentAt() *SentAt {

    return new(SentAt)
}