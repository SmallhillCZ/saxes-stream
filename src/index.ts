import { Transform, TransformOptions, TransformCallback } from "stream";
import { SaxesParser } from "saxes";

export interface SaxParserChunk {
  path: string;
  event: "opentag" | "text" | "closetag";
  text: string;
}

export class SaxParser extends Transform {

  parser: SaxesParser;

  path: string;

  constructor(saxesOptions: any = {}, streamOptions: TransformOptions = {}) {

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
      this.push({ path: this.path, event: "opentag" })
    }

    this.parser.ontext = (text) => {
      this.push({ path: this.path, event: "text", text })
    }

    this.parser.onclosetag = (tag) => {
      this.push({ path: this.path, event: "closetag" })
      this.path = this.path.replace(/\.[^\.]+$/u, "");
    }
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