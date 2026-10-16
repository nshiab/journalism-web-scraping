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

Requires **Node.js 24.21.0 or later**. Use `import`
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
