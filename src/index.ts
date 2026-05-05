/**
 * @module
 *
 * The Journalism library (web scraping functions)
 *
 * To install the library with Deno, use:
 * ```bash
 * deno add jsr:@nshiab/journalism-web-scraping
 * ```
 *
 * To install the library with Node.js, use:
 * ```bash
 * npm i @nshiab/journalism-web-scraping
 * ```
 *
 * To import a function, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-web-scraping";
 * ```
 */

import getStatCanTable from "./web-scraping/getStatCanTable.ts";
import getHtmlTable from "./web-scraping/getHtmlTable.ts";
import downloadFile from "./web-scraping/downloadFile.ts";

export { downloadFile, getHtmlTable, getStatCanTable };
