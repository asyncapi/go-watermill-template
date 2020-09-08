package content

type Encoder interface {
	Marshal(interface{}) ([]byte, error)
}

type Decoder interface {
	Unmarshal([]byte, interface{}) error
}