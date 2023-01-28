import * as xmlJs from "xml-js";
import axios from "axios";

export interface IFeed {
  title: string;
  link: string;
  description: string;
  items: Array<IFeedItem>;
}

export interface IFeedItem {
  // standard fields
  title: string;
  link: string;
  pubDate: string;
  id: string;
  description: string;
  // custom fields
  content: string;
  publishedEpoch: number;
}

export async function fetchFeedTitle(feedUrl: string): Promise<string> {
  const feedParsed = await fetchAndParseFeed(feedUrl);
  return feedParsed.title;
}

export async function fetchFeedItems(feedUrl: string): Promise<Array<IFeedItem>> {
  const feedParsed = await fetchAndParseFeed(feedUrl);
  return feedParsed.items;
}

export async function fetchAndParseFeed(feedUrl: string) {
  const feedXml = await axios.get(feedUrl);
  const feedRawParsed: any = await xmlJs.xml2js(feedXml.data, {
    ignoreComment: true,
    ignoreAttributes: false,
    alwaysChildren: true,
    compact: true,
  });

  let feedParsed: IFeed = {} as IFeed;
  if (feedRawParsed.rss) {
    feedParsed = await parseRss(feedRawParsed.rss);
  } else if (feedRawParsed.feed) {
    feedParsed = await parseAtom(feedRawParsed.feed);
  } else {
    throw new Error(`Feed type not supported for: ${feedUrl}`);
  }

  return feedParsed;
}

export function parseRss(rawRssDocument: any) {
  const feed: IFeed = {
    title: getFeedElementText(rawRssDocument.channel.title),
    link: getFeedElementText(rawRssDocument.channel.link),
    description: getFeedElementText(rawRssDocument.channel.description),
    items: [],
  };

  const items = Array.isArray(rawRssDocument.channel.item)
    ? rawRssDocument.channel.item
    : [rawRssDocument.channel.item];
  const feedItems: Array<IFeedItem> = items.map((item: any) => {
    return {
      title: getFeedElementText(item.title),
      link: getFeedElementText(item.link),
      pubDate: getFeedElementText(item.pubDate),
      id: getFeedElementText(item.guid),
      description: getFeedElementText(item.description),
      content: getFeedElementText(item["content:encoded"]) || getFeedElementText(item.description),
      publishedEpoch: new Date(getFeedElementText(item.pubDate)).getTime(),
    } as IFeedItem;
  });

  feed.items = feedItems;

  return feed;
}

export function parseAtom(rawAtomDocument: any) {
  const htmlLink = rawAtomDocument.link.find((link: any) => link._attributes.type == "text/html");
  const feed: IFeed = {
    title: getFeedElementText(rawAtomDocument.title),
    link: (htmlLink || rawAtomDocument.link[0])._attributes.href,
    description: getFeedElementText(rawAtomDocument.subtitle),
    items: [],
  };

  const items = Array.isArray(rawAtomDocument.entry) ? rawAtomDocument.entry : [rawAtomDocument.entry];
  const feedItems: Array<IFeedItem> = items.map((currentEntry: any) => {
    return {
      title: getFeedElementText(currentEntry.title),
      link: currentEntry.link._attributes.href,
      pubDate: getFeedElementText(currentEntry.published),
      id: getFeedElementText(currentEntry.id),
      description: getFeedElementText(currentEntry.description),
      content: getFeedElementText(getFeedElementText(currentEntry.content)),
      publishedEpoch: new Date(getFeedElementText(currentEntry.published)).getTime(),
    } as IFeedItem;
  });

  feed.items = feedItems;

  return feed;
}

function getFeedElementText(element: any) {
  if (!element) {
    return null;
  } else {
    return element._cdata || element._text || "";
  }
}
