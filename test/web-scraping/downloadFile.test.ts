import { expect, test } from "vite-plus/test";
import { downloadFile } from "../../src/index.ts";
import { existsSync, mkdirSync, readFileSync } from "node:fs";

if (!existsSync("./test/output")) {
  mkdirSync("./test/output");
}

const liveTest = test.skipIf(process.env.CI === "true");

liveTest("should download a file", async function () {
  await downloadFile(
    "https://raw.githubusercontent.com/nshiab/journalism-web-scraping/main/test/data/data.json",
    "./test/output/data.json",
  );
  const originalData: unknown = JSON.parse(readFileSync("./test/data/data.json", "utf-8"));
  const downloadedData: unknown = JSON.parse(readFileSync("./test/output/data.json", "utf-8"));

  expect(downloadedData).toEqual(originalData);
});
