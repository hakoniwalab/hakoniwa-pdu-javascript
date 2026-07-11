export class CdrError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CdrError';
    }
}

export const CDR_LE_ENCAPSULATION = new Uint8Array([0x00, 0x01, 0x00, 0x00]);

export class PduCdrWriter {
    constructor(initialSize = 1024) {
        this.buffer = new ArrayBuffer(initialSize);
        this.dataView = new DataView(this.buffer);
        this.offset = 0;
        this.alignmentBase = 0;
    }

    _ensureCapacity(needed) {
        if (this.offset + needed > this.buffer.byteLength) {
            const newSize = Math.max(this.buffer.byteLength * 2, this.offset + needed);
            const newBuffer = new ArrayBuffer(newSize);
            new Uint8Array(newBuffer).set(new Uint8Array(this.buffer));
            this.buffer = newBuffer;
            this.dataView = new DataView(this.buffer);
        }
    }

    _align(size) {
        const relativeOffset = this.offset - this.alignmentBase;
        const padding = (size - (relativeOffset % size)) % size;
        this._ensureCapacity(padding);
        for (let i = 0; i < padding; i++) {
            this.dataView.setUint8(this.offset + i, 0);
        }
        this.offset += padding;
    }

    get_buf() {
        return this.buffer.slice(0, this.offset);
    }

    write_encapsulation() {
        this._ensureCapacity(4);
        new Uint8Array(this.buffer, this.offset, 4).set(CDR_LE_ENCAPSULATION);
        this.offset += 4;
        this.alignmentBase = this.offset;
    }

    write_sequence_length(value) {
        const length = value.length;
        if (length > 0xFFFFFFFF) {
            throw new CdrError("CDR sequence too large");
        }
        this.write_uint32(length);
    }

    _write(fmt, value, size) {
        this._align(size);
        this._ensureCapacity(size);
        this.dataView[fmt](this.offset, value, true);
        this.offset += size;
    }

    write_boolean(value) {
        this._align(1);
        this._ensureCapacity(1);
        this.dataView.setUint8(this.offset, value ? 1 : 0);
        this.offset += 1;
    }

    write_bool(value) {
        this.write_boolean(value);
    }

    write_uint8(value) {
        if (typeof value === 'string') {
            value = value.charCodeAt(0) || 0;
        }
        this._write('setUint8', value, 1);
    }

    write_int8(value) { this._write('setInt8', value, 1); }
    write_uint16(value) { this._write('setUint16', value, 2); }
    write_int16(value) { this._write('setInt16', value, 2); }
    write_uint32(value) { this._write('setUint32', value, 4); }
    write_int32(value) { this._write('setInt32', value, 4); }
    write_uint64(value) { this._write('setBigUint64', BigInt(value), 8); }
    write_int64(value) { this._write('setBigInt64', BigInt(value), 8); }
    write_float32(value) { this._write('setFloat32', value, 4); }
    write_float64(value) { this._write('setFloat64', value, 8); }

    write_string(value) {
        const encodedString = new TextEncoder().encode(String(value));
        const length = encodedString.length + 1;
        this.write_uint32(length);
        this._ensureCapacity(length);
        new Uint8Array(this.buffer, this.offset).set(encodedString);
        this.dataView.setUint8(this.offset + encodedString.length, 0);
        this.offset += length;
    }
}

export class PduCdrReader {
    constructor(buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.buffer = buffer;
        } else if (ArrayBuffer.isView(buffer)) {
            this.buffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        } else {
            throw new CdrError('Input must be an ArrayBuffer or ArrayBufferView');
        }
        this.dataView = new DataView(this.buffer);
        this.offset = 0;
        this.alignmentBase = 0;
    }

    _require(size) {
        if (this.offset + size > this.buffer.byteLength) {
            throw new CdrError("CDR payload ended unexpectedly");
        }
    }

    _align(size) {
        const relativeOffset = this.offset - this.alignmentBase;
        const padding = (size - (relativeOffset % size)) % size;
        this._require(padding);
        this.offset += padding;
    }

    read_encapsulation() {
        if (this.buffer.byteLength < 4) {
            throw new CdrError("CDR payload is too short for encapsulation");
        }
        const encapsulation = new Uint8Array(this.buffer, 0, 4);
        if (!encapsulation.every((value, index) => value === CDR_LE_ENCAPSULATION[index])) {
            throw new CdrError(`Unsupported CDR encapsulation: ${encapsulation}`);
        }
        this.offset = 4;
        this.alignmentBase = this.offset;
    }

    _read(fmt, size) {
        this._align(size);
        this._require(size);
        const value = this.dataView[fmt](this.offset, true);
        this.offset += size;
        return value;
    }

    read_boolean() {
        return this._read('getUint8', 1) !== 0;
    }

    read_bool() { return this.read_boolean(); }
    read_uint8() { return this._read('getUint8', 1); }
    read_int8() { return this._read('getInt8', 1); }
    read_uint16() { return this._read('getUint16', 2); }
    read_int16() { return this._read('getInt16', 2); }
    read_uint32() { return this._read('getUint32', 4); }
    read_int32() { return this._read('getInt32', 4); }
    read_uint64() { return this._read('getBigUint64', 8); }
    read_int64() { return this._read('getBigInt64', 8); }
    read_float32() { return this._read('getFloat32', 4); }
    read_float64() { return this._read('getFloat64', 8); }

    read_string() {
        const length = this.read_uint32();
        if (length === 0) {
            return "";
        }
        this._require(length);
        const end = this.offset + length - 1;
        const value = new TextDecoder().decode(this.buffer.slice(this.offset, end));
        this.offset += length;
        return value;
    }
}
