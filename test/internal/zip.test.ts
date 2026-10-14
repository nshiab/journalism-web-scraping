import { expect, test } from "vite-plus/test";
import { deflateRawSync } from "node:zlib";
import { extractZipEntry } from "../../src/internal/zip.ts";

test("extractZipEntry extracts deflated and stored entries", () => {
  const content = new TextEncoder().encode("hello from a ZIP archive");

  for (const compressionMethod of [0, 8]) {
    const archive = createZip("data.csv", content, compressionMethod);
    expect(extractZipEntry(archive, "data.csv")).toEqual(content);
  }
});

test("extractZipEntry returns undefined when the entry is absent", () => {
  const archive = createZip("data.csv", new Uint8Array([1, 2, 3]), 8);
  expect(extractZipEntry(archive, "other.csv")).toEqual(undefined);
});

test("extractZipEntry rejects corrupted entry data", () => {
  const archive = createZip("data.csv", new Uint8Array([1, 2, 3]), 0);
  archive[30 + "data.csv".length] ^= 0xff;

  expect(() => extractZipEntry(archive, "data.csv")).toThrowError(
    new Error("ZIP entry data.csv failed its CRC check."),
  );
});

function createZip(name: string, content: Uint8Array, compressionMethod: number): Uint8Array {
  const nameBytes = new TextEncoder().encode(name);
  const compressed = compressionMethod === 8 ? deflateRawSync(content) : content;
  const localLength = 30 + nameBytes.length + compressed.length;
  const centralLength = 46 + nameBytes.length;
  const archive = new Uint8Array(localLength + centralLength + 22);
  const view = new DataView(archive.buffer);
  const crc = crc32(content);

  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(8, compressionMethod, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, compressed.length, true);
  view.setUint32(22, content.length, true);
  view.setUint16(26, nameBytes.length, true);
  archive.set(nameBytes, 30);
  archive.set(compressed, 30 + nameBytes.length);

  const centralOffset = localLength;
  view.setUint32(centralOffset, 0x02014b50, true);
  view.setUint16(centralOffset + 4, 20, true);
  view.setUint16(centralOffset + 6, 20, true);
  view.setUint16(centralOffset + 10, compressionMethod, true);
  view.setUint32(centralOffset + 16, crc, true);
  view.setUint32(centralOffset + 20, compressed.length, true);
  view.setUint32(centralOffset + 24, content.length, true);
  view.setUint16(centralOffset + 28, nameBytes.length, true);
  archive.set(nameBytes, centralOffset + 46);

  const endOffset = localLength + centralLength;
  view.setUint32(endOffset, 0x06054b50, true);
  view.setUint16(endOffset + 8, 1, true);
  view.setUint16(endOffset + 10, 1, true);
  view.setUint32(endOffset + 12, centralLength, true);
  view.setUint32(endOffset + 16, centralOffset, true);

  return archive;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
