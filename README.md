# SaxesStream
NodeJS Streams wrapper around SaxesParser (package saxes) with single event stream.

## Example
```typescript

import { Transform, TransformOptions, TransformCallback } from "stream";
import { SaxesParser, SaxesOptions } from "saxes";
import request from "request";

const httpStream = request(url);

const const saxesOptions:SaxesOptions = {
  // ...
}

const streamOptions:TransformOptions = {
  // ...
}

const parser = new SaxesStream(saxesOptions, streamOptions);

const customTransform = new CustomTransform();

const outputStream = httpStream.pipe(parser).pipe(customTransform);

class CustomTransform extends Transform {
 // TODO
}


```
