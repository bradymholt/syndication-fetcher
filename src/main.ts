import * as xmlJs from "xml-js";
import axios from "axios";

export interface IFeed {
  /* The feed title */
  title: string;
  /* The feed description */
  description: string;
  /** The link to the HTML version of the feed item */
  link: string;
  /** The feed items */
  items: Array<IFeedItem>;
}

export interface IFeedItem {
  /** The unique ID of the feed item */
  id: string;
  /** The title of the feed item */
  title: string;
  /** The description of the feed item */
  description: string;
  /** The link to the HTML version of the feed item */
  link: string;
  /** The item publish date as a string */
  pubDate: string;
  /** The item contents */
  content: string;
  /** The item publish date represented as an epoch number (seconds since 00:00:00 UTC on 1 January 1970) */
  publishedEpoch: number;
}

export async function fetchFeed(feedUrl: string) {
  const feedXml = await axios.get(feedUrl);
  const rawFeedParsedFromXml: any = await xmlJs.xml2js(feedXml.data, {
    ignoreComment: true,
    ignoreAttributes: false,
    alwaysChildren: true,
    compact: true,
  });

  let feedParsed: IFeed = {} as IFeed;
  if (rawFeedParsedFromXml.rss) {
    feedParsed = await parseRssFeed(rawFeedParsedFromXml);
  } else if (rawFeedParsedFromXml.feed) {
    feedParsed = await parseAtomFeed(rawFeedParsedFromXml);
  } else {
    throw new Error(`Feed type not supported for: ${feedUrl}`);
  }

  return feedParsed;
}

export function parseRssFeed(rawRssDocument: any) {
  if (!rawRssDocument.rss?.channel) {
    throw new Error("Invalid RSS feed - expected to find `rss.channel` object path.");
  }

  const sourceRssChannel = rawRssDocument.rss.channel;
  const parsedFeed: IFeed = {
    title: getFeedElementText(sourceRssChannel.title),
    link: getFeedElementText(sourceRssChannel.link),
    description: getFeedElementText(sourceRssChannel.description),
    items: [],
  };

  const items = Array.isArray(sourceRssChannel.item) ? sourceRssChannel.item : [sourceRssChannel.item];
  const feedItems: Array<IFeedItem> = items.map((item: any) => {
    return {
      title: getFeedElementText(item.title),
      description: getFeedElementText(item.description),
      link: getFeedElementText(item.link),
      pubDate: getFeedElementText(item.pubDate),
      id: getFeedElementText(item.guid),
      content: getFeedElementText(item["content:encoded"]) || getFeedElementText(item.description),
      publishedEpoch: new Date(getFeedElementText(item.pubDate)).getTime(),
    } as IFeedItem;
  });

  parsedFeed.items = feedItems;

  return parsedFeed;
}

export function parseAtomFeed(rawAtomDocument: any) {
  if (!rawAtomDocument.feed?.title) {
    throw new Error("Invalid Atom feed - expected to find `feed.title` object path.");
  }

  const sourceAtomFeed = rawAtomDocument.feed;
  const htmlLink = sourceAtomFeed.link.find((link: any) => link._attributes.type == "text/html");
  const parsedFeed: IFeed = {
    title: getFeedElementText(sourceAtomFeed.title),
    description: getFeedElementText(sourceAtomFeed.subtitle),
    link: (htmlLink || sourceAtomFeed.link[0])._attributes.href,
    items: [],
  };

  const items = Array.isArray(sourceAtomFeed.entry) ? sourceAtomFeed.entry : [sourceAtomFeed.entry];
  const feedItems: Array<IFeedItem> = items.map((currentEntry: any) => {
    return {
      title: getFeedElementText(currentEntry.title),
      description: getFeedElementText(currentEntry.description),
      link: currentEntry.link._attributes.href,
      pubDate: getFeedElementText(currentEntry.published),
      id: getFeedElementText(currentEntry.id),
      content: getFeedElementText(getFeedElementText(currentEntry.content)),
      publishedEpoch: new Date(getFeedElementText(currentEntry.published)).getTime(),
    } as IFeedItem;
  });

  parsedFeed.items = feedItems;

  return parsedFeed;
}

function getFeedElementText(element: any) {
  if (!element) {
    return null;
  } else {
    return element._cdata || element._text || "";
  }
}
