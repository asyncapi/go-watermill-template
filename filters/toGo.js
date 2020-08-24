// Lodash built-ins for fixing casing
var upperFirst = require('lodash/upperFirst');
var camelCase = require('lodash/camelCase');

// AsyncAPI Data types+format specifications
// https://www.asyncapi.com/docs/specifications/2.0.0/#a-name-datatypeformat-a-data-type-formats

// Format values for the 'number' type as defined for the datatypes
const FORMAT_NUM_FLOAT = 'float'
const FORMAT_NUM_DOUBLE = 'double'

// MAP_NUM_TYPE maps AsyncAPI format value to a Go type 
const MAP_NUM_TYPE = {
    FORMAT_NUM_FLOAT: 'float32',
    FORMAT_NUM_DOUBLE: 'float64'
}

// toGoPrimitive translates an AsyncAPI data-type combination (type + format)
// and outputs the equivalent Go primitive
exports.toGoPrimitive = (type, format) => {
    // Each of the following cases MUST return a value. If no value
    // is returned before exiting the switch, an empty string is returned
    switch (type.toLowerCase()) {
        // Nothing to do for string
        // TODO: bin / hex decoding 
        case 'string':
            return 'string'
        
        case 'boolean':
            return 'bool'

        case 'integer':
            // AsyncAPI integer formats are 'int64' & 'int32'
            // these align with Go types already
            // if format not provided, default to 64-bit
            if (!format) {
                return 'int64'
            } else {
                return type
            }
        case 'number':
            // Return a format's mapped type
            // If no type mapping known, return format as-is
            if (format && MAP_NUM_TYPE[format]) {
                return MAP_NUM_TYPE[format]
            } else {
                // If format is not provided, assume largest float
                return MAP_NUM_TYPE[FORMAT_NUM_DOUBLE]
            }
    }

    return ""
}

exports.toGoPublicID = (id) => {
    return upperFirst(camelCase(id))
}

exports.toGoPrivateID = (id) => {
    return camelCase(id)
}