const path = require("path");
const Transform = require("readable-stream").Transform;
const util = require("archiver-utils");
const UINT64 = require("cuint").UINT64;

class Asar extends Transform {
  constructor () {
    super();

    this.header = {files: {}};
    this.offset = UINT64(0);
    this.out = [];  // Buffer[]
    this.outLen = 0;  // This is identical to this.offset, one should be eliminated

    this.supports = {
      directory: true
    };
  }

  _searchNodeFromDirectory(p) {
    let json = this.header;
    const dirs = p.split(path.sep);
    for (const dir of dirs) {
      if (dir !== ".") {
        json = json.files[dir];
      }
    }
    return json;
  }

  _searchNodeFromPath(p) {
    if (!p) { return this.header; }
    const name = path.basename(p);
    const node = this._searchNodeFromDirectory(path.dirname(p));
    if (node.files == null) {
      node.files = {};
    }
    if (node.files[name] == null) {
      node.files[name] = {};
    }
    return node.files[name];
  }

  append(source, data, callback) {
    console.log(data.type, data.name);
    const dirNode = this._searchNodeFromPath(path.dirname(data.name));
    const node = this._searchNodeFromPath(data.name);

    const handler = (err, sourceBuffer) => {
      if (err) { return callback(err); }
      const size = sourceBuffer.length || 0;
      if (size > 4294967295) {
        throw new Error(`${data.name}: file size can not be larger than 4.2GB`);
      }

      node.size = size;
      node.offset = this.offset.toString();
      if (data.mode & 0o100) {
        node.executable = true;
      }
      this.offset.add(UINT64(size));
      this.outLen += size;
      this.out.push(sourceBuffer);
    };

    if (data.sourceType === "buffer") {
      handler(null, source);
    } else if (data.sourceType === "stream") {
      util.collectStream(source, handler);
    }
  }

  finalize() {
    const headerPickle = pickle.createEmpty();
    headerPickle.writeString(JSON.stringify(this.header));
    const headerBuf = headerPickle.toBuffer();

    const sizePickle = pickle.createEmpty();
    sizePickle.writeUInt32(headerBuf.length);
    const sizeBuf = sizePickle.toBuffer();

    this.outLen += headerBuf.length;
    this.outLen += sizeBuf.length;
    this.out.unshift(headerBuf);
    this.out.unshift(sizeBuf);

    this.write(Buffer.concat(out, outLen));
    out = [];

    this.end();
  }
}

module.exports = Asar;
