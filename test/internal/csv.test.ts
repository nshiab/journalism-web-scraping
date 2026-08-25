import { assertEquals } from "jsr:@std/assert";
import { csvFormatRow, csvParse } from "../../src/internal/csv.ts";

Deno.test("csvParse handles quoted fields, newlines, and missing values", () => {
  const csv =
    'name,description,value\r\n"Ada, A.","line one\nline ""two""",3\r\nGrace,,\r\n';

  assertEquals(csvParse(csv), [
    {
      name: "Ada, A.",
      description: 'line one\nline "two"',
      value: "3",
    },
    { name: "Grace", description: "", value: "" },
  ]);
});

Deno.test("csvParse matches d3-dsv behavior for duplicate columns", () => {
  assertEquals(csvParse("name,name,missing\nfirst,last"), [
    { name: "last", missing: "" },
  ]);
});

Deno.test("csvFormatRow quotes CSV control characters", () => {
  assertEquals(
    csvFormatRow(["plain", "with,comma", 'with "quote"', "with\nnewline"]),
    'plain,"with,comma","with ""quote""","with\nnewline"',
  );
});
