import { SaxesStream } from "../src"


describe("Should parse XML correctly", () => {

  const parser = new SaxesStream();

  const events: any = [];
  let error: any;

  parser.on("data", data => events.push(data));

  parser.on("error", err => error = err);

  test("Output is as expected", () => {
    parser.on("finish", () => {
      expect(events).toEqual([
        { event: "opentag", path: ".books", tag: { name: "books", isSelfClosing: false, attributes: {} } },
        { event: "opentag", path: ".books.book", tag: { name: "book", isSelfClosing: false, attributes: {} } },
        { event: "opentag", path: ".books.book.name", tag: { name: "name", isSelfClosing: false, attributes: {} } },
        { event: "text", path: ".books.book.name", text: "Book" },
        { event: "closetag", path: ".books.book.name", tag: { name: "name", isSelfClosing: false, attributes: {} } },
        { event: "opentag", path: ".books.book.description", tag: { name: "description", isSelfClosing: false, attributes: {} } },
        { event: "text", path: ".books.book.description", text: "Description" },
        { event: "closetag", path: ".books.book.description", tag: { name: "description", isSelfClosing: false, attributes: {} } },
        { event: "closetag", path: ".books.book", tag: { name: "book", isSelfClosing: false, attributes: {} } },
        { event: "closetag", path: ".books", tag: { name: "books", isSelfClosing: false, attributes: {} } }
      ])
    })
  });

  test("No error was emitted", () => {
    parser.on("finish", () => {
      expect(error).toBe(undefined);
    });
  });

  parser.write(`<books><book><name>Book</name><description>Description</description></book></books>`);

  parser.end();

})