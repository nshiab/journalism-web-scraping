[**Journalism Web Scraping v2.0.7**](index.md)

***

# Journalism Web Scraping v2.0.7

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

- [downloadFile](functions/downloadFile.md)
- [getHtmlTable](functions/getHtmlTable.md)
- [getStatCanTable](functions/getStatCanTable.md)
