# SaxesStream
NodeJS Streams wrapper around [SaxesParser](https://www.npmjs.com/package/saxes) (npm package saxes)
 
 - Single event stream
 - Pipable to other streams
 - TypeScript declarations

## API

#### Input

Any string/Buffer Saxes would accept.

#### Output chunk format:
```ts
export interface SaxesStreamChunk {
  
  /**
   * Tag path. Example: .books.book.name for <books><book><name>TEXT</name></book></books>
   */
  path: string;
  
  /**
   * Saxes event name. Currently supports: opentag, text and closetag events.
   */
  event: "opentag" | "text" | "closetag";
  
  /**
   * Text inside of tag. Only present on text event.
   */
  text?: string;
}
```

#### Events
Standard NodeJS Streams events.

## Example 1 - Get huge online XML of books and stream parse it into CSV
```typescript

import { SaxesOptions, SaxesStream, SaxesStreamChunk } from "saxes-stream";

import { Transform, TransformOptions, TransformCallback } from "stream";
import request from "request";
import fs from "fs";
import stringify from "csv-stringify";


/* Source HTTP XML stream */
const httpStream = request(url);


/* SaxesStream XML parser */
const const saxesOptions: SaxesOptions = {
  // ...
}

const streamOptions: TransformOptions = {
  // ...
}

const parser = new SaxesStream(saxesOptions, streamOptions);


/* Custom Transform Stream to pick the data from XML */
class BookTransform extends Transform {

  item: any = {};

  // Stream setting 
  readableObjectMode = true;
  writableObjectMode = true;

  _transform(chunk: SaxesStreamChunk, encoding: string, callback: TransformCallback) {

    /* Save parts by matching path */
    if (chunk.event === "text") {
      switch (chunk.path) {
        case ".books.book.title": this.item["title"] = chunk.text; break;
        case ".books.book.content": this.item["content"] = chunk.text; break;
      }
    }

    /* On ending </book> tag emit the completed book object as data (or piped to a next stream) */
    if (chunk.event === "closetag") {
      switch (chunk.path) {
        case ".books.book":
          this.push(this.item); 
          this.item = {};
          break;
      }
    }

    callback();

  }

}

const bookTransform = new BookTransform();


/* JSON -> CSV Transform Stream */
const csv = stringify({ delimiter: ',' });


/* File Write Stream */
const file = fs.createWriteStream('./books.csv');


/* PIPE ALL THINGS TOGETHER */
httpStream.pipe(parser).pipe(bookTransform).pipe(csv).pipe(file);


```
