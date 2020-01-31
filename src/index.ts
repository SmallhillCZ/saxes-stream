import { Transform, TransformOptions, TransformCallback } from "stream";
import { SaxesParser, SaxesOptions, SaxesTag } from "saxes";

export { SaxesOptions } from "saxes";

export type SaxesStreamChunk =
  { event: "opentag", path: string, tag: SaxesTag } |
  { event: "text", path: string, text: string } |
  { event: "closetag", path: string, tag: SaxesTag };

export class SaxesStream extends Transform {

  parser: SaxesParser;

  path: string;

  constructor(saxesOptions: SaxesOptions = {}, streamOptions: TransformOptions = {}) {

    const defaultStreamOptions: TransformOptions = {
      readableObjectMode: true,
      writableObjectMode: false
    };

    streamOptions = Object.assign(defaultStreamOptions, streamOptions);

    super(streamOptions);

    this.path = "";

    this.parser = new SaxesParser(saxesOptions);

    this.parser.onopentag = (tag) => {
      this.path = [this.path, tag.name].join(".");
      this.push({ path: this.path, event: "opentag", tag })
    }

    this.parser.ontext = (text) => {
      this.push({ path: this.path, event: "text", text })
    }

    this.parser.onclosetag = (tag) => {
      this.push({ path: this.path, event: "closetag", tag })
      this.path = this.path.replace(/\.[^\.]+$/u, "");
    }
  }

  push(chunk: SaxesStreamChunk, encoding?: string) {
    return super.push(chunk, encoding);
  }

  _transform(chunk: string, encoding: string, callback: TransformCallback) {
    this.parser.write(chunk);
    callback();
  }

  _flush(callback: TransformCallback) {
    this.parser.close();
    callback();
  }
}