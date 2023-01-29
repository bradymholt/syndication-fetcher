# syndication-fetcher [![NPM Package](https://img.shields.io/npm/v/syndication-fetcher.svg)](https://www.npmjs.com/package/syndication-fetcher)

A RSS and Atom feed fetcher and parser. Given a URL, it will fetch a feed and parse it into a common JavaScript object. TypeScript types are included. Both RSS and Atom feeds are supported and the parser will automatically detect the feed type.

## Installation

```bash
npm install syndication-fetcher
```

## Usage

```javascript
import { fetchAndParseFeed } from "syndication-fetcher";

const feed = await fetchFeed("https://example.com/feed.xml");
/* feed is an object with the following properties:
{
  title: string;
  description: string;
  link: string;  
  items: Array<IFeedItem>;
}
*/
```

## TypeScript types

```typescript
interface IFeed {
  title: string;
  description: string;
  link: string;
  items: Array<IFeedItem>;
}

export interface IFeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  content: string;
  publishedEpoch: number;
}
```
