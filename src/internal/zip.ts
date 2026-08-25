import { inflateRawSync } from "node:zlib";

const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const CENTRAL_DIRECTORY_ENTRY = 0x02014b50;
const LOCAL_FILE_HEADER = 0x04034b50;
const MAX_COMMENT_LENGTH = 0xffff;
const CRC_TABLE = createCrcTable();

/** Extract one entry from a non-ZIP64, single-disk ZIP archive. */
export function extractZipEntry(
  archive: Uint8Array,
  wantedName: string,
): Uint8Array | undefined {
  const view = new DataView(
    archive.buffer,
    archive.byteOffset,
    archive.byteLength,
  );
  const endOffset = findEndOfCentralDirectory(view);

  const diskNumber = readUint16(view, endOffset + 4);
  const centralDirectoryDisk = readUint16(view, endOffset + 6);
  const entriesOnDisk = readUint16(view, endOffset + 8);
  const entryCount = readUint16(view, endOffset + 10);
  const centralDirectorySize = readUint32(view, endOffset + 12);
  const centralDirectoryOffset = readUint32(view, endOffset + 16);

  if (
    diskNumber !== 0 || centralDirectoryDisk !== 0 ||
    entriesOnDisk !== entryCount
  ) {
    throw new Error("Multi-disk ZIP archives are not supported.");
  }
  if (
    entryCount === 0xffff || centralDirectorySize === 0xffffffff ||
    centralDirectoryOffset === 0xffffffff
  ) {
    throw new Error("ZIP64 archives are not supported.");
  }
  assertRange(
    archive,
    centralDirectoryOffset,
    centralDirectorySize,
    "central directory",
  );

  let offset = centralDirectoryOffset;
  for (let index = 0; index < entryCount; index++) {
    assertSignature(view, offset, CENTRAL_DIRECTORY_ENTRY, "central directory");
    assertRange(archive, offset, 46, "central directory entry");

    const flags = readUint16(view, offset + 8);
    const compressionMethod = readUint16(view, offset + 10);
    const expectedCrc = readUint32(view, offset + 16);
    const compressedSize = readUint32(view, offset + 20);
    const uncompressedSize = readUint32(view, offset + 24);
    const fileNameLength = readUint16(view, offset + 28);
    const extraLength = readUint16(view, offset + 30);
    const commentLength = readUint16(view, offset + 32);
    const localHeaderOffset = readUint32(view, offset + 42);
    const entryLength = 46 + fileNameLength + extraLength + commentLength;

    assertRange(archive, offset, entryLength, "central directory entry");
    const name = new TextDecoder().decode(
      archive.subarray(offset + 46, offset + 46 + fileNameLength),
    );

    if (name === wantedName) {
      if ((flags & 1) !== 0) {
        throw new Error(`ZIP entry ${wantedName} is encrypted.`);
      }
      if (
        compressedSize === 0xffffffff || uncompressedSize === 0xffffffff ||
        localHeaderOffset === 0xffffffff
      ) {
        throw new Error("ZIP64 archives are not supported.");
      }

      const data = extractEntryData(
        archive,
        view,
        localHeaderOffset,
        compressedSize,
        compressionMethod,
        wantedName,
      );
      if (data.byteLength !== uncompressedSize) {
        throw new Error(`ZIP entry ${wantedName} has an invalid size.`);
      }
      if (crc32(data) !== expectedCrc) {
        throw new Error(`ZIP entry ${wantedName} failed its CRC check.`);
      }
      return data;
    }

    offset += entryLength;
  }

  return undefined;
}

function extractEntryData(
  archive: Uint8Array,
  view: DataView,
  localHeaderOffset: number,
  compressedSize: number,
  compressionMethod: number,
  name: string,
): Uint8Array {
  assertSignature(
    view,
    localHeaderOffset,
    LOCAL_FILE_HEADER,
    "local file header",
  );
  assertRange(archive, localHeaderOffset, 30, "local file header");
  const fileNameLength = readUint16(view, localHeaderOffset + 26);
  const extraLength = readUint16(view, localHeaderOffset + 28);
  const dataOffset = localHeaderOffset + 30 + fileNameLength + extraLength;
  assertRange(archive, dataOffset, compressedSize, `ZIP entry ${name}`);
  const compressed = archive.subarray(dataOffset, dataOffset + compressedSize);

  if (compressionMethod === 0) return compressed.slice();
  if (compressionMethod === 8) {
    return new Uint8Array(inflateRawSync(compressed));
  }
  throw new Error(
    `ZIP entry ${name} uses unsupported compression method ${compressionMethod}.`,
  );
}

function findEndOfCentralDirectory(view: DataView): number {
  const minimumOffset = Math.max(0, view.byteLength - 22 - MAX_COMMENT_LENGTH);
  for (let offset = view.byteLength - 22; offset >= minimumOffset; offset--) {
    if (
      readUint32(view, offset) === END_OF_CENTRAL_DIRECTORY &&
      offset + 22 + readUint16(view, offset + 20) === view.byteLength
    ) {
      return offset;
    }
  }
  throw new Error("Invalid ZIP archive: end of central directory not found.");
}

function assertSignature(
  view: DataView,
  offset: number,
  expected: number,
  description: string,
): void {
  if (readUint32(view, offset) !== expected) {
    throw new Error(`Invalid ZIP archive: malformed ${description}.`);
  }
}

function assertRange(
  archive: Uint8Array,
  offset: number,
  length: number,
  description: string,
): void {
  if (
    !Number.isSafeInteger(offset) || !Number.isSafeInteger(length) ||
    offset < 0 || length < 0 || offset + length > archive.byteLength
  ) {
    throw new Error(`Invalid ZIP archive: truncated ${description}.`);
  }
}

function readUint16(view: DataView, offset: number): number {
  if (offset < 0 || offset + 2 > view.byteLength) return -1;
  return view.getUint16(offset, true);
}

function readUint32(view: DataView, offset: number): number {
  if (offset < 0 || offset + 4 > view.byteLength) return -1;
  return view.getUint32(offset, true);
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createCrcTable(): Uint32Array {
  return Uint32Array.from({ length: 256 }, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit++) {
      value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
    }
    return value >>> 0;
  });
}
