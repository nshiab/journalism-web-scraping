import { expect, test } from "vite-plus/test";
import { csvFormatRow, csvParse } from "../../src/internal/csv.ts";

test("csvParse handles quoted fields, newlines, and missing values", () => {
  const csv = 'name,description,value\r\n"Ada, A.","line one\nline ""two""",3\r\nGrace,,\r\n';

  expect(csvParse(csv)).toEqual([
    {
      name: "Ada, A.",
      description: 'line one\nline "two"',
      value: "3",
    },
    { name: "Grace", description: "", value: "" },
  ]);
});

test("csvParse matches d3-dsv behavior for duplicate columns", () => {
  expect(csvParse("name,name,missing\nfirst,last")).toEqual([{ name: "last", missing: "" }]);
});

test("csvFormatRow quotes CSV control characters", () => {
  expect(csvFormatRow(["plain", "with,comma", 'with "quote"', "with\nnewline"])).toEqual(
    'plain,"with,comma","with ""quote""","with\nnewline"',
  );
});
