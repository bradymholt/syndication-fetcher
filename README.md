# syndication-fetcher

A RSS and Atom feed fetcher and parser.  Given a URL, it will fetch a feed and parse it into a JavaScript object.  TypeScript types are included.

## Installation

```bash
npm install syndication-fetcher
```

## Usage

```javascript
import { fetchAndParseFeed } from "syndication-fetcher";

const feed = await fetchAndParseFeed("https://example.com/feed.xml");
console.log(feed.title);
console.log(feed.link);
console.log(feed.entries[0].title);
```

## TypeScript types

```typescript
interface IFeed {
  title: string;
  link: string;
  description: string;
  items: Array<IFeedItem>;
}

export interface IFeedItem {  
  title: string;
  link: string;
  pubDate: string;
  id: string;
  description: string;
  content: string;
  publishedEpoch: number;
}
```
