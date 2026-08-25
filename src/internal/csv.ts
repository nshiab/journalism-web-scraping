/*
 * Adapted from d3-dsv 3.0.1:
 * https://github.com/d3/d3-dsv/blob/v3.0.1/src/dsv.js
 *
 * Copyright 2013-2021 Mike Bostock
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

const EOL = Symbol("EOL");
const EOF = Symbol("EOF");
const QUOTE = 34;
const NEWLINE = 10;
const RETURN = 13;
const COMMA = 44;

/** Parse CSV text into objects using the first row as column names. */
export function csvParse(text: string): Array<Record<string, string>> {
  let columns: string[] = [];
  let convert: ((row: string[]) => Record<string, string>) | undefined;

  const rows = parseRows(text, (row) => {
    if (convert === undefined) {
      columns = row;
      convert = objectConverter(columns);
      return undefined;
    }
    return convert(row);
  });

  return rows;
}

/** Format one row according to CSV quoting rules. */
export function csvFormatRow(row: readonly unknown[]): string {
  return row.map(formatValue).join(",");
}

function objectConverter(columns: readonly string[]) {
  return (row: readonly string[]): Record<string, string> => {
    const object: Record<string, string> = {};
    for (let index = 0; index < columns.length; index++) {
      object[columns[index]] = row[index] || "";
    }
    return object;
  };
}

function parseRows<T>(
  text: string,
  convert: (row: string[], index: number) => T | undefined,
): T[] {
  const rows: T[] = [];
  let length = text.length;
  let characterIndex = 0;
  let rowIndex = 0;
  let eof = length <= 0;
  let eol = false;

  if (text.charCodeAt(length - 1) === NEWLINE) length--;
  if (text.charCodeAt(length - 1) === RETURN) length--;

  function token(): string | typeof EOL | typeof EOF {
    if (eof) return EOF;
    if (eol) {
      eol = false;
      return EOL;
    }

    const start = characterIndex;
    let end: number;
    let character: number;

    if (text.charCodeAt(start) === QUOTE) {
      while (
        (characterIndex++ < length &&
          text.charCodeAt(characterIndex) !== QUOTE) ||
        text.charCodeAt(++characterIndex) === QUOTE
      ) {
        // Find the closing, non-escaped quote.
      }
      if ((end = characterIndex) >= length) {
        eof = true;
      } else if ((character = text.charCodeAt(characterIndex++)) === NEWLINE) {
        eol = true;
      } else if (character === RETURN) {
        eol = true;
        if (text.charCodeAt(characterIndex) === NEWLINE) characterIndex++;
      }
      return text.slice(start + 1, end - 1).replaceAll('""', '"');
    }

    while (characterIndex < length) {
      character = text.charCodeAt(end = characterIndex++);
      if (character === NEWLINE) eol = true;
      else if (character === RETURN) {
        eol = true;
        if (text.charCodeAt(characterIndex) === NEWLINE) characterIndex++;
      } else if (character !== COMMA) continue;
      return text.slice(start, end);
    }

    eof = true;
    return text.slice(start, length);
  }

  let value: string | typeof EOL | typeof EOF;
  while ((value = token()) !== EOF) {
    const row: string[] = [];
    while (value !== EOL && value !== EOF) {
      row.push(value);
      value = token();
    }
    const converted = convert(row, rowIndex++);
    if (converted !== undefined) rows.push(converted);
  }

  return rows;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const string = String(value);
  return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}
