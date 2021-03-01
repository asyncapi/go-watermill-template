package transport

type ContentReader interface { 
	Read([]byte, interface{}) error
}

type ContentWriter interface { 
	Write(interface{}) ([]byte, error)
}