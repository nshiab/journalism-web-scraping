# The Journalism library

To install the library with Deno, use:

```bash
deno add jsr:@nshiab/journalism
```

To install the library with Node.js, use:

```bash
npx jsr add @nshiab/journalism
```

To import a function, use:

```ts
import { functionName } from "@nshiab/journalism";
```

## downloadFile

Downloads a file from a given URL and saves it to a specified local path. This
function is useful for programmatically fetching resources from the web, such as
datasets, images, or documents.

The function uses streams for efficient handling of potentially large files,
ensuring that the entire file does not need to be loaded into memory at once.

### Signature

```typescript
async function downloadFile(url: string, filePath: string): Promise<void>;
```

### Parameters

- **`url`**: The URL of the file to download. This should be a complete and
  valid URL (e.g., 'https://example.com/data.zip').
- **`filePath`**: The absolute or relative local path where the downloaded file
  should be saved (e.g., './downloads/report.pdf').

### Examples

```ts
// Basic usage: Download a CSV file.
await downloadFile(
  "https://example.com/data.csv",
  "./data/downloaded_data.csv",
);
console.log("CSV file downloaded successfully!");
```

```ts
// Download an image file.
await downloadFile(
  "https://www.example.com/image.jpg",
  "./images/downloaded_image.jpg",
);
console.log("Image downloaded successfully!");
```

## getHtmlTable

Extracts tabular data from an HTML table on a given URL and returns it as an
array of objects. This function is particularly useful for scraping structured
data from web pages.

### Signature

```typescript
async function getHtmlTable(
  url: string,
  options?: { selector?: string; index?: number },
): Promise<DSVRowArray<string>>;
```

### Parameters

- **`url`**: - The URL of the web page containing the HTML table.
- **`options`**: - An optional object to specify how to locate the table.
- **`options.selector`**: - A CSS selector string to identify the target table
  on the page. If not provided, the function will look for the first `<table>`
  element.
- **`options.index`**: - The 0-based index of the table to select if multiple
  tables match the `selector`. Defaults to `0`.

### Returns

A Promise that resolves to an array of objects representing the table data,
where each row is an object with column headers as keys.

### Examples

```ts
// Extract data from the first table on a page
const data = await getHtmlTable("https://example.com/data");
console.log(data[0]); // Accessing data from the first row
```

```ts
// Extract data from a specific table using a selector and index
// This parses the fourth table with the class name 'data-table'.
const specificTableData = await getHtmlTable("https://example.com/data", {
  selector: ".data-table",
  index: 3,
});
console.table(specificTableData);
```

## getStatCanTable

Retrieves tabular data from Statistics Canada's website using a provided Product
ID (PID). This function automates the process of fetching, unzipping, and
parsing the CSV data directly from StatCan's API, making it easy to integrate
official Canadian statistics into applications or analyses.

The PID is a unique identifier for each table on the Statistics Canada website.
It can typically be found in the URL of the table's page (e.g.,
`https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=98100001` where
`98100001` is the PID).

### Signature

```typescript
async function getStatCanTable(
  pid: string,
  options?: { lang?: "en" | "fr"; returnRawCSV?: boolean; debug?: boolean },
): Promise<string | DSVRowArray<string>>;
```

### Parameters

- **`pid`**: - The Product ID (PID) of the Statistics Canada table. This is a
  string of up to 8 digits. If a longer string is provided, it will be truncated
  to the first 8 characters.
- **`options`**: - Optional settings to customize the data retrieval.
- **`options.lang`**: - The language of the table data. Can be 'en' for English
  or 'fr' for French. Defaults to 'en'.
- **`options.returnRawCSV`**: - A boolean indicating whether to return the raw
  CSV data as a string instead of a parsed array of objects. Useful for direct
  file storage or custom parsing. Defaults to `false`.
- **`options.debug`**: - A boolean indicating whether to enable debug logging to
  the console, showing fetch URLs and other process details. Defaults to
  `false`.

### Returns

A Promise that resolves to either a `string` (if `returnRawCSV` is `true`) or an
array of objects representing the table rows.

### Examples

```ts
// Retrieve data for a specific Statistics Canada table (e.g., PID '98100001').
const data = await getStatCanTable("98100001");
console.table(data);
```

```ts
// Retrieve data in French and return as raw CSV.
const rawCsvData = await getStatCanTable("98100001", {
  lang: "fr",
  returnRawCSV: true,
});
console.log(rawCsvData);
```

```ts
// The function automatically truncates PIDs longer than 8 characters.
const truncatedPidData = await getStatCanTable("9810000112345", {
  debug: true,
});
console.table(truncatedPidData); // Console will show a warning about truncation.
```
