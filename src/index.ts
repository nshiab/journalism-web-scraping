/**
 * @module
 *
 * The Journalism library
 *
 * To install the library with Deno, use:
 * ```bash
 * deno add jsr:@nshiab/journalism
 * ```
 *
 * To install the library with Node.js, use:
 * ```bash
 * npx jsr add @nshiab/journalism
 * ```
 *
 * To import a function, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism";
 * ```
 */

import getStatCanTable from "./web-scraping/getStatCanTable.ts";
import getHtmlTable from "./web-scraping/getHtmlTable.ts";
import downloadFile from "./web-scraping/downloadFile.ts";

export { downloadFile, getHtmlTable, getStatCanTable };
