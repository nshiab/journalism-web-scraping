**Journalism Web Scraping v2.0.10**

***

# The Journalism Library (web scraping)

Useful TypeScript functions for downloading files and extracting tables from the web.
Part of the [journalism library](https://github.com/nshiab/journalism).

The library is maintained by [Nael Shiab](https://naelshiab.com/), computational
journalist and senior data producer for [CBC News](https://www.cbc.ca/news).

> [!TIP]
> To learn how to use this library and more, check out
> [Code Like a Journalist](https://www.code-like-a-journalist.com/), a free and
> open-source data analysis and data visualization course in TypeScript. You
> might also find
> [simple-data-analysis](https://github.com/nshiab/simple-data-analysis) useful.

## Installation

Use `import`
and set `"type": "module"` in your project's `package.json`.

```sh
npm install @nshiab/journalism-web-scraping
```

```ts
import { getHtmlTable } from "@nshiab/journalism-web-scraping";

const html = "<table><tr><th>Name</th></tr><tr><td>Ada</td></tr></table>";
const data = await getHtmlTable(html);
console.log(data); // [{ Name: "Ada" }]
```

To start a data project with folders, configuration and documentation for AI
agents, run:

```sh
npx @nshiab/setup-data-project
```

## Documentation

- [Documentation](https://nshiab.github.io/journalism-web-scraping/)
- [llms.txt — Documentation index for AI agents](https://nshiab.github.io/journalism-web-scraping/llms.txt)
- [llm.md — Complete Markdown reference](https://nshiab.github.io/journalism-web-scraping/llm.md),
  for AI assistants or offline reading
- [npm package](https://www.npmjs.com/package/@nshiab/journalism-web-scraping)

See
[CONTRIBUTING.md](https://github.com/nshiab/journalism-web-scraping/blob/main/CONTRIBUTING.md)
for development commands.

Download files and extract tables from the web.

Install with `npm install @nshiab/journalism-web-scraping`.
Requires Node.js 24.21.0 or later and ES modules.

## Example

```ts
import { getHtmlTable } from "@nshiab/journalism-web-scraping";

const html = "<table><tr><th>Name</th></tr><tr><td>Ada</td></tr></table>";
const data = await getHtmlTable(html);
console.log(data); // [{ Name: "Ada" }]
```

## Web scraping

### downloadFile()

> **downloadFile**(`url`, `filePath`): `Promise`\<`void`\>

Downloads a file from a given URL and saves it to a specified local path. This function is useful for programmatically fetching resources from the web, such as datasets, images, or documents.

The function uses streams for efficient handling of potentially large files, ensuring that the entire file does not need to be loaded into memory at once.

#### Parameters

##### url

`string`

The URL of the file to download. This should be a complete and valid URL (e.g., 'https://example.com/data.zip').

##### filePath

`string`

The absolute or relative local path where the downloaded file should be saved (e.g., './downloads/report.pdf').

#### Returns

`Promise`\<`void`\>

#### Examples

```ts
// Basic usage: Download a CSV file.
await downloadFile("https://example.com/data.csv", "./data/downloaded_data.csv");
console.log("CSV file downloaded successfully!");
```

```ts
// Download an image file.
await downloadFile("https://www.example.com/image.jpg", "./images/downloaded_image.jpg");
console.log("Image downloaded successfully!");
```

***

### getHtmlTable()

> **getHtmlTable**(`urlOrHtml`, `options?`): `Promise`\<`Record`\<`string`, `string`\>[]\>

Extracts tabular data from an HTML table from a given URL or an HTML string and returns it as an array of objects. This function is particularly useful for scraping structured data from web pages.

If the page uses JavaScript to render the table, you should fetch the HTML first using a tool like Playwright or Puppeteer and then pass the HTML string to this function.

#### Parameters

##### urlOrHtml

`string`

The URL of the web page containing the HTML table or the HTML string itself.

##### options?

An optional object to specify how to locate the table.

###### index?

`number`

The 0-based index of the table to select if multiple tables match the `selector`. Defaults to `0`.

###### selector?

`string`

A CSS selector string to identify the target table on the page. If not provided, the function will look for the first `<table>` element.

#### Returns

`Promise`\<`Record`\<`string`, `string`\>[]\>

A Promise that resolves to an array of objects representing the table data, where each row is an object with column headers as keys.

#### Examples

```ts
// Extract data from the first table on a page via URL
const data = await getHtmlTable("https://example.com/data");
console.log(data[0]); // Accessing data from the first row
```

```ts
// Extract data from a specific table using a selector and index
// This parses the fourth table with the class name 'data-table'.
const specificTableData = await getHtmlTable("https://example.com/data", {
  selector: ".data-table",
  index: 3
});
console.table(specificTableData);
```

```ts
// Extract data from an HTML string
const html = "<table><tr><th>Header</th></tr><tr><td>Data</td></tr></table>";
const dataFromHtml = await getHtmlTable(html);
console.log(dataFromHtml);
```

***

### getStatCanTable()

> **getStatCanTable**(`pid`, `options?`): `Promise`\<`string` \| `Record`\<`string`, `string`\>[]\>

Retrieves tabular data from Statistics Canada's website using a provided Product ID (PID). This function automates the process of fetching, unzipping, and parsing the CSV data directly from StatCan's API, making it easy to integrate official Canadian statistics into applications or analyses.

The PID is a unique identifier for each table on the Statistics Canada website. It can typically be found in the URL of the table's page (e.g., `https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=98100001` where `98100001` is the PID).

#### Parameters

##### pid

`string`

The Product ID (PID) of the Statistics Canada table. This is a string of up to 8 digits. If a longer string is provided, it will be truncated to the first 8 characters.

##### options?

Optional settings to customize the data retrieval.

###### debug?

`boolean`

A boolean indicating whether to enable debug logging to the console, showing fetch URLs and other process details. Defaults to `false`.

###### lang?

`"en"` \| `"fr"`

The language of the table data. Can be 'en' for English or 'fr' for French. Defaults to 'en'.

###### returnRawCSV?

`boolean`

A boolean indicating whether to return the raw CSV data as a string instead of a parsed array of objects. Useful for direct file storage or custom parsing. Defaults to `false`.

#### Returns

`Promise`\<`string` \| `Record`\<`string`, `string`\>[]\>

A Promise that resolves to either a `string` (if `returnRawCSV` is `true`) or an array of objects representing the table rows.

#### Examples

```ts
// Retrieve data for a specific Statistics Canada table (e.g., PID '98100001').
const data = await getStatCanTable('98100001');
console.table(data);
```

```ts
// Retrieve data in French and return as raw CSV.
const rawCsvData = await getStatCanTable('98100001', {
  lang: 'fr',
  returnRawCSV: true,
});
console.log(rawCsvData);
```

```ts
// The function automatically truncates PIDs longer than 8 characters.
const truncatedPidData = await getStatCanTable('9810000112345', { debug: true });
console.table(truncatedPidData); // Console will show a warning about truncation.
```
