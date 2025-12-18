import { assertEquals } from "jsr:@std/assert";
import { downloadFile } from "../../src/index.ts";
import { existsSync, mkdirSync, readFileSync } from "node:fs";

if (!existsSync("./test/output")) {
  mkdirSync("./test/output");
}

Deno.test("should download a file", async function () {
  await downloadFile(
    "https://raw.githubusercontent.com/nshiab/journalism/main/test/data/data.json",
    "./test/output/data.json",
  );
  const originalData = JSON.parse(
    readFileSync("./test/data/data.json", "utf-8"),
  );
  const downloadedData = JSON.parse(
    readFileSync("./test/output/data.json", "utf-8"),
  );

  assertEquals(downloadedData, originalData);
});
