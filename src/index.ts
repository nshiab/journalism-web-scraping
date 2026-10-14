/**
 * Download files and extract tables from the web.
 *
 * Install with `npm install @nshiab/journalism-web-scraping`.
 * Requires Node.js 24.21.0 or later and ES modules.
 *
 * @example
 * ```ts
 * import { getHtmlTable } from "@nshiab/journalism-web-scraping";
 *
 * const html = "<table><tr><th>Name</th></tr><tr><td>Ada</td></tr></table>";
 * const data = await getHtmlTable(html);
 * console.log(data); // [{ Name: "Ada" }]
 * ```
 *
 * @module
 */

import getStatCanTable from "./web-scraping/getStatCanTable.ts";
import getHtmlTable from "./web-scraping/getHtmlTable.ts";
import downloadFile from "./web-scraping/downloadFile.ts";

export { downloadFile, getHtmlTable, getStatCanTable };
