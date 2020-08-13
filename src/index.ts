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

  errored: boolean;

  constructor(saxesOptions: SaxesOptions = {}, streamOptions: TransformOptions = {}) {

    const defaultStreamOptions: TransformOptions = {
      readableObjectMode: true,
      writableObjectMode: false
    };

    streamOptions = Object.assign(defaultStreamOptions, streamOptions);

    super(streamOptions);

    this.path = "";
    this.errored = false;

    this.parser = new SaxesParser(saxesOptions);

    this.parser.onopentag = (tag) => {
      if (!this.errored) {
        this.path = [this.path, tag.name].join(".");
        this.push({ path: this.path, event: "opentag", tag })
      }
    }

    this.parser.ontext = (text) => {
      if (!this.errored) {
        this.push({ path: this.path, event: "text", text })
      }
    }

    this.parser.onclosetag = (tag) => {
      if (!this.errored) {
        this.push({ path: this.path, event: "closetag", tag })
        this.path = this.path.replace(/\.[^\.]+$/u, "");
      }
    }

    this.parser.onerror = (err) => {
      this.errored = true;
      this.emit("error", err);
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