## Concatenated octet sequence
Encodes and decodes a map-object composite by key-value properties into/from a binary format. Each property value is encoded based on its type and placed into the binary format after the last encoded value; the order of the values is determined by the order in the schema.

## Usage
```js
  const concatenantedOctetSeq = require('./');

  const schema = [
    {
      property: 'version',
      type: 'uint8'
    },

    {
      property: 'type',
      type: 'uint8'
    },

    {
      property: 'token_id',
      type: 'bytes',
      length: { value: 16 }
    },

    {
      property: 'issuer_length',
      type: 'uint16'
    },

    {
      property: 'issuer',
      type: 'string',
      length: { property: 'issuer_length' }
    }
  ];

  const values = {
    version: 1,
    type: 2,
    token_id: new Buffer('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    issuer: 'https://me.com'
  };

  const encoded = concatenantedOctetSeq.encode(schema, values); // Buffer

  console.log(Buffer.isBuffer(encoded), encoded.toString('hex'));
  // Prints: true '0102aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa000e68747470733a2f2f6d652e636f6d'

  const decoded = concatenantedOctetSeq.decode(schema, encoded);

  console.log(decoded);
  // Prints:
  // {
  //   properties: {
  //     version: 1,
  //     type: 2,
  //     token_id: <Buffer aa aa aa aa aa aa aa aa aa aa aa aa aa aa aa aa>,
  //     issuer_length: 14,
  //     issuer: 'https://me.com'
  //   },
  //  parsed: <Buffer 01 02 aa aa aa aa aa aa aa aa aa aa aa aa aa aa aa aa 00 0e 68 74 74 70 73 3a 2f 2f 6d 65 2e 63 6f 6d>,
  //  left: <Buffer >
  // }
```

## API
### .encode(schema, values)
Encodes an object (the values) into a sequence of bytes based on the
schema.

**Returns:** Buffer
**Parameters**:
* schema (array.<object>): see [below](#schema).
* values (object): object to encode based on the schema.

### .decode(schema, sequence)
Decodes a sequence encoded by "encode" method (pr equivalent mechanism) into an object based on the schema.

**Returns:** Object: { properties, parsed, left }
  * properties (Object): the decoded object
  * parsed (Buffer): the parsed part of the input sequence
  * left (Buffer): the non-parsed part of the input sequence

**Parameters**:
* schema (array.<object>): see [below](#schema).
* sequence (Buffer): encoded sequence of bytes represented as a JS Buffer.

## Schema
The schema describes how properties are going to be encoded / decoded and its position in the resulting sequence of bytes.
An schema is an array of descriptor-objects, where every object describes how to encode or decode a value, the position in the array corresponds with the position of the encoded values on the resulting binary sequence.

Example:
```js
const schema = [
    {
      property: 'version',
      type: 'uint8'
    },

    {
      property: 'token_id',
      type: 'bytes',
      length: { value: 16 }
    },

    // ...
  ];
```

### Descriptor objects
Each object in the schema array has the following required properties:
* `property`: property that is going to be encoded / decoded.
* `type` the expected type name. The supported types are:

| Type name | JS Representation |  Size type   |
|-----------|-------------------|--------------|
| `uint8`   | `number`          | Fixed        |
| `int8`    | `number`          | Fixed        |
| `uint16`  | `number`          | Fixed        |
| `int16`   | `number`          | Fixed        |
| `double`  | `number`          | Fixed        |
| `float`   | `number`          | Fixed        |
| `string`  | `string`          | Dynamic      |
| `bytes`   | `Buffer`          | Dynamic      |
| `byte`    | `Buffer`          | Fixed        |
| `array`   | `array`           | Dynamic      |

There are basically two types of properties sizes:
  * fixed: the size of the encoded value is determined by the type itself
  no extra information is required.

  Example:
  ```js
    {
      type: 'uint8',
      property: 'age'
    }
  ```

  * dynamic: the size of the encoded value is not determined by the type, so an extra `length` property must be provided. Those types require more information as part of the descriptor object on the schema to get information about the size.

#### Dynamic types
Apart from the required properties you must specify the length, the length of a give property must be specified as part of the descriptor inside of the property `length` which must be an object that can contain
  * a `property` property: that references a previously defined property in the schema.

  Example:
  ```js
    [
      // ...,

      {
        property: 'issuer_length',
        type: 'uint16'
      },

      {
        property: 'issuer',
        type: 'string',
        length: { property: 'issuer_length' }
      },

      // ...
    ]
  ```
  *The length of `issuer` depends on the value of `issuer_length` defined
  before.*

  * a `value` property: in which case the length will be the one specified as the `value` property.

  Example:
  ```js
  [
    // ...,

    {
      property: 'token_id',
      type: 'bytes',
      length: { value: 16 }
    },

    // ...
  ]
  ```

#### Arrays
Arrays are an special kind of dynamic type, they can contain elements of
any of the fixed types elements, array of dynamic size types are currently not supported.

Apart from `property`, `type` and `length`, the object descriptor for an
array must contain the `item` property; that property is an object containing the
`type` of the items contained by the array.

Example:
```js
  [
    // ...,

    {
      property: 'dynamic_size_array_length',
      type: 'int8',
    },

    {
      property: 'dynamic_size_array_test',
      type: 'array',
      items: {
        type: 'int8'
      },
      length: { property: 'dynamic_size_array_length'}
    },

    // ...
  ]
```

