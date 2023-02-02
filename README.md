# syndication-fetcher [![NPM Package](https://img.shields.io/npm/v/syndication-fetcher.svg)](https://www.npmjs.com/package/syndication-fetcher)

A RSS and Atom feed fetcher and parser. Given a URL, it will fetch a feed and parse it into a common JavaScript object.  TypeScript types are included.

## Installation

```bash
npm install syndication-fetcher
```

## Usage

```javascript
import { fetchFeed } from "syndication-fetcher";
// or using CommonJS
// const { fetchFeed } = require("syndication-fetcher");

const feed = await fetchFeed("https://example.com/feed.xml");
/* `feed` is an object that conforms to the IFeed interface described below */
```

## TypeScript types

```typescript
interface IFeed {
  title: string;
  description: string;
  link: string;
  items: Array<IFeedItem>;
}

interface IFeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date | null;
  content: string; 
}
```
