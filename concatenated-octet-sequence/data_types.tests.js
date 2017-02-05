'use strict'

const expect = require('chai').expect
const dataTypes = require('./data_types')

describe('data types', function() {
  describe('uint8', function() {
    describe('#read', function() {
      it('reads a number from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.writeUInt8(12, 8)
        expect(dataTypes.int8.read(buffer, { offset: 8 })).to.equal(12)
      })
    })

    describe('#write', function() {
      it('writes a number to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.int8.write(buffer, 12, { offset: 8 })).to.equal(1)
        expect(buffer.readUInt8(8)).to.equal(12)
      })
    })
  })

  describe('int8', function() {
    describe('#read', function() {
      it('reads a number from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.writeInt8(-12, 8)
        expect(dataTypes.int8.read(buffer, { offset: 8 })).to.equal(-12)
      })
    })

    describe('#write', function() {
      it('writes a number to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.int8.write(buffer, -12, { offset: 8 })).to.equal(1)
        expect(buffer.readInt8(8)).to.equal(-12)
      })
    })
  })

  describe('byte', function() {
    describe('#read', function() {
      it('reads a byte from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.write('a', 8, 'utf8')

        const read = dataTypes.byte.read(buffer, { offset: 8 })
        expect(Buffer.isBuffer(read)).to.be.true
        expect(read.toString('utf8')).to.equal('a')
      })
    })

    describe('#write', function() {
      it('writes a byte to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.byte.write(buffer, new Buffer('a', 'utf8'), { offset: 8 })).to.equal(1)
        expect(buffer.slice(8, 9).toString('utf8')).to.equal('a')
      })
    })

    describe('when value is not a buffer', function() {
      it('throws an exception', function() {
        expect(() => dataTypes.byte.write(new Buffer(12), 'a', { offset: 8 })).to.throw()
          .and.have.property('message', 'value must be a buffer')
      })
    })

    describe('when buffer length is greater than 1', function() {
      it('throws an exception', function() {
        expect(() => dataTypes.byte.write(new Buffer(20), new Buffer('ab', 'utf8'), { offset: 8 })).to.throw()
          .and.have.property('message', 'buffer to long max length: 1 byte')
      })
    })
  })

  describe('uint16', function() {
    describe('#read', function() {
      it('reads a number from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.writeUInt16BE(12, 8)
        expect(dataTypes.uint16.read(buffer, { offset: 8 })).to.equal(12)
      })
    })

    describe('#write', function() {
      it('writes a number to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.uint16.write(buffer, 12, { offset: 8 })).to.equal(2)
        expect(buffer.readUInt16BE(8)).to.equal(12)
      })
    })
  })

  describe('int16', function() {
    describe('#read', function() {
      it('reads a number from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.writeInt16BE(-12, 8)
        expect(dataTypes.int16.read(buffer, { offset: 8 })).to.equal(-12)
      })
    })

    describe('#write', function() {
      it('writes a number to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.int16.write(buffer, -12, { offset: 8 })).to.equal(2)
        expect(buffer.readInt16BE(8)).to.equal(-12)
      })
    })
  })

  describe('double', function() {
    describe('#read', function() {
      it('reads a number from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.writeDoubleBE(-12.2, 8)
        expect(dataTypes.double.read(buffer, { offset: 8 })).to.equal(-12.2)
      })
    })

    describe('#write', function() {
      it('writes a number to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.double.write(buffer, -12.2, { offset: 8 })).to.equal(8)
        expect(buffer.readDoubleBE(8)).to.equal(-12.2)
      })
    })
  })

  describe('float', function() {
    describe('#read', function() {
      it('reads a number from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.writeFloatBE(-12.300000190734863, 8)
        expect(dataTypes.float.read(buffer, { offset: 8 })).to.equal(-12.300000190734863)
      })
    })

    describe('#write', function() {
      it('writes a number to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.float.write(buffer, -12.300000190734863, { offset: 8 })).to.equal(4)
        expect(buffer.readFloatBE(8)).to.equal(-12.300000190734863)
      })
    })
  })

  describe('string', function() {
    describe('#read', function() {
      it('reads an string from the correct offset', function() {
        const buffer = new Buffer(20)
        buffer.write('hola', 8, 'utf8')
        expect(dataTypes.string.read(buffer, { offset: 8, length: 4 })).to.equal('hola')
      })
    })

    describe('#write', function() {
      it('writes a number to the correct offset', function() {
        const buffer = new Buffer(20)
        expect(dataTypes.string.write(buffer, 'hola', { offset: 8 })).to.equal(4)
        expect(buffer.slice(8, 12).toString('utf8')).to.equal('hola')
      })
    })
  })

  describe('bytes', function() {
    describe('#read', function() {
      it('reads a bytes from the correct offset', function() {
        const buffer = new Buffer(13)
        buffer[8] = 12
        buffer[9] = 121
        buffer[10] = 122
        buffer[11] = 123
        buffer[12] = 123

        const expectedBuffer = new Buffer(5)
        expectedBuffer[0] = 12
        expectedBuffer[1] = 121
        expectedBuffer[2] = 122
        expectedBuffer[3] = 123
        expectedBuffer[4] = 123

        const read = dataTypes.bytes.read(buffer, { offset: 8, length: 5 })
        expect(Buffer.isBuffer(read)).to.be.true
        expect(read).to.eql(expectedBuffer)
      })
    })

    describe('#write', function() {
      it('writes a bytes to the correct offset', function() {
        const outputBuffer = new Buffer(13)
        outputBuffer.fill(0)

        const toWriteBuffer = new Buffer(5)
        toWriteBuffer.fill(0)
        toWriteBuffer[0] = 12
        toWriteBuffer[1] = 121
        toWriteBuffer[2] = 122
        toWriteBuffer[3] = 123
        toWriteBuffer[4] = 123

        const expectedBuffer = new Buffer(13)
        expectedBuffer.fill(0)
        expectedBuffer[8] = 12
        expectedBuffer[9] = 121
        expectedBuffer[10] = 122
        expectedBuffer[11] = 123
        expectedBuffer[12] = 123

        expect(dataTypes.bytes.write(outputBuffer, toWriteBuffer, { offset: 8 })).to.equal(5)
        expect(outputBuffer).to.eql(expectedBuffer)
      })

      describe('when value is not a buffer', function() {
        it('throws an exception', function() {
          expect(() => dataTypes.bytes.write(new Buffer(12), 'a', { offset: 8 })).to.throw()
            .and.have.property('message', 'value must be a buffer')
        })
      })
    })
  })

  describe('array', function() {
    describe('of uint8', function() {
      describe('#read', function() {
        it('reads an array of uint18 from the correct offset', function() {
          const buffer = new Buffer(20)
          buffer.writeUInt8(12, 8)
          buffer.writeUInt8(11, 9)
          buffer.writeUInt8(10, 10)
          buffer.writeUInt8(9, 11)
          expect(dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'uint8' } })).to.eql([12, 11, 10, 9])
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          const expectedBuffer = new Buffer(20)
          expectedBuffer.fill(0)
          expectedBuffer.writeUInt8(12, 8)
          expectedBuffer.writeUInt8(11, 9)
          expectedBuffer.writeUInt8(10, 10)
          expectedBuffer.writeUInt8(9, 11)

          const buffer = new Buffer(20)
          buffer.fill(0)

          expect(dataTypes.array.write(buffer, [12, 11, 10, 9], { offset: 8, items: { type: 'uint8' } })).to.equal(4)
          expect(buffer.equals(expectedBuffer)).to.be.true
        })
      })
    })

    describe('of int8', function() {
      describe('#read', function() {
        it('reads an array of uint18 from the correct offset', function() {
          const buffer = new Buffer(20)
          buffer.writeInt8(12, 8)
          buffer.writeInt8(-11, 9)
          buffer.writeInt8(-10, 10)
          buffer.writeInt8(9, 11)
          expect(dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'int8' } })).to.eql([12, -11, -10, 9])
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          const expectedBuffer = new Buffer(20)
          expectedBuffer.fill(0)
          expectedBuffer.writeInt8(12, 8)
          expectedBuffer.writeInt8(-11, 9)
          expectedBuffer.writeInt8(-10, 10)
          expectedBuffer.writeInt8(9, 11)

          const buffer = new Buffer(20)
          buffer.fill(0)

          expect(dataTypes.array.write(buffer, [12, -11, -10, 9], { offset: 8, items: { type: 'int8' } })).to.equal(4)
          expect(buffer.equals(expectedBuffer)).to.be.true
        })
      })
    })

    describe('of byte', function() {
      describe('#read', function() {
        it('reads an array of uint18 from the correct offset', function() {
          const buffer = new Buffer(20)
          buffer[8] = 233
          buffer[9] = 255
          buffer[10] = 222
          buffer[11] = 223

          const result = dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'byte' } })
          expect(Array.isArray(result)).to.be.true
          expect(Buffer.isBuffer(result[0])).to.be.true
          expect(Buffer.isBuffer(result[1])).to.be.true
          expect(Buffer.isBuffer(result[2])).to.be.true
          expect(Buffer.isBuffer(result[3])).to.be.true
          expect(result[0][0]).to.equal(233)
          expect(result[1][0]).to.equal(255)
          expect(result[2][0]).to.equal(222)
          expect(result[3][0]).to.equal(223)
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          const buffer1 = new Buffer(1)
          buffer1[0] = 233
          const buffer2 = new Buffer(1)
          buffer2[0] = 255
          const buffer3 = new Buffer(1)
          buffer3[0] = 222
          const buffer4 = new Buffer(1)
          buffer4[0] = 223

          const buffer = new Buffer(20)

          expect(dataTypes.array.write(buffer, [
            buffer1,
            buffer2,
            buffer3,
            buffer4
          ], { offset: 8, items: { type: 'byte' } })).to.equal(4)

          expect(buffer[8]).to.equal(233)
          expect(buffer[9]).to.equal(255)
          expect(buffer[10]).to.equal(222)
          expect(buffer[11]).to.equal(223)
        })
      })
    })

    describe('of int16', function() {
      describe('#read', function() {
        it('reads an array of int16 from the correct offset', function() {
          const buffer = new Buffer(20)
          buffer.writeInt16BE(1000, 8)
          buffer.writeInt16BE(-1000, 10)
          buffer.writeInt16BE(-1001, 12)
          buffer.writeInt16BE(1002, 14)
          expect(dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'int16' } })).to.eql([1000, -1000, -1001, 1002])
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          const expectedBuffer = new Buffer(20)
          expectedBuffer.fill(0)
          expectedBuffer.writeInt16BE(1000, 8)
          expectedBuffer.writeInt16BE(-1000, 10)
          expectedBuffer.writeInt16BE(-1001, 12)
          expectedBuffer.writeInt16BE(1002, 14)

          const buffer = new Buffer(20)
          buffer.fill(0)

          expect(dataTypes.array.write(buffer, [1000, -1000, -1001, 1002], { offset: 8, items: { type: 'int16' } })).to.equal(8)
          expect(buffer.equals(expectedBuffer)).to.be.true
        })
      })
    })

    describe('of uint16', function() {
      describe('#read', function() {
        it('reads an array of uint16 from the correct offset', function() {
          const buffer = new Buffer(20)
          buffer.writeInt16BE(1000, 8)
          buffer.writeInt16BE(1000, 10)
          buffer.writeInt16BE(1001, 12)
          buffer.writeInt16BE(1002, 14)
          expect(dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'uint16' } })).to.eql([1000, 1000, 1001, 1002])
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          const expectedBuffer = new Buffer(20)
          expectedBuffer.fill(0)
          expectedBuffer.writeInt16BE(1000, 8)
          expectedBuffer.writeInt16BE(1000, 10)
          expectedBuffer.writeInt16BE(1001, 12)
          expectedBuffer.writeInt16BE(1002, 14)

          const buffer = new Buffer(20)
          buffer.fill(0)

          expect(dataTypes.array.write(buffer, [1000, 1000, 1001, 1002], { offset: 8, items: { type: 'uint16' } })).to.equal(8)
          expect(buffer.equals(expectedBuffer)).to.be.true
        })
      })
    })

    describe('of double', function() {
      describe('#read', function() {
        it('reads an array of double from the correct offset', function() {
          const buffer = new Buffer(50)
          buffer.writeDoubleBE(1000.2, 8)
          buffer.writeDoubleBE(1000.3, 16)
          buffer.writeDoubleBE(1001.4, 24)
          buffer.writeDoubleBE(1002.5, 32)
          expect(dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'double' } })).to.eql([1000.2, 1000.3, 1001.4, 1002.5])
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          const expectedBuffer = new Buffer(50)
          expectedBuffer.fill(0)
          expectedBuffer.writeDoubleBE(1000.2, 8)
          expectedBuffer.writeDoubleBE(1000.3, 16)
          expectedBuffer.writeDoubleBE(1001.4, 24)
          expectedBuffer.writeDoubleBE(1002.5, 32)

          const buffer = new Buffer(50)
          buffer.fill(0)

          expect(dataTypes.array.write(buffer, [1000.2, 1000.3, 1001.4, 1002.5], { offset: 8, items: { type: 'double' } })).to.equal(32)
          expect(buffer.equals(expectedBuffer)).to.be.true
        })
      })
    })

    describe('of float', function() {
      describe('#read', function() {
        it('reads an array of double from the correct offset', function() {
          const buffer = new Buffer(50)
          buffer.writeFloatBE(1000.2000122070312, 8)
          buffer.writeFloatBE(1000.2999877929688, 12)
          buffer.writeFloatBE(1001.4000244140625, 16)
          buffer.writeFloatBE(1002.5, 20)
          expect(dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'float' } })).to.eql([
            1000.2000122070312,
            1000.2999877929688,
            1001.4000244140625,
            1002.5
          ])
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          const expectedBuffer = new Buffer(50)
          expectedBuffer.fill(0)
          expectedBuffer.writeFloatBE(1000.2000122070312, 8)
          expectedBuffer.writeFloatBE(1000.2999877929688, 12)
          expectedBuffer.writeFloatBE(1001.4000244140625, 16)
          expectedBuffer.writeFloatBE(1002.5, 20)

          const buffer = new Buffer(50)
          buffer.fill(0)

          expect(dataTypes.array.write(buffer, [1000.2, 1000.3, 1001.4, 1002.5], { offset: 8, items: { type: 'float' } })).to.equal(16)
          expect(buffer.equals(expectedBuffer)).to.be.true
        })
      })
    })

    describe('of string', function() {
      describe('#read', function() {
        it('reads an array of string from the correct offset', function() {
          expect(() => {
            const buffer = new Buffer(50)

            dataTypes.array.read(buffer, { offset: 8, length: 4, items: { type: 'string' } })
          })
          .to.throw().and.have.property('message', 'item type string is not supported')
        })
      })

      describe('#write', function() {
        it('writes a number to the correct offset', function() {
          expect(() => dataTypes.array.write(new Buffer(20), ['abc', 'abc'], { offset: 8, items: { type: 'string' } }))
            .to.throw().and.have.property('message', 'item type string is not supported')
        })
      })
    })
  })
})
