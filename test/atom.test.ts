import axios from "axios";
import { fetchAndParseFeed } from "../src/main";

jest.mock("axios");

describe("atom", () => {
  it("fetches a parsed a simple feed with multiple entries", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: `\    
<feed
	xmlns="http://www.w3.org/2005/Atom">
	<generator uri="https://jekyllrb.com/" version="3.9.2">Jekyll</generator>
	<link href="https://test.com/atom.xml" rel="self" type="application/atom+xml"/>
	<link href="https://test.com/" rel="alternate" type="text/html"/>
	<updated>2023-01-20T15:53:17+00:00</updated>
	<id>https://test.com/atom.xml</id>
	<title type="html">A Test Title</title>
	<subtitle>A Test Sub-title</subtitle>
	<author>
		<name>John Doe</name>
	</author>
	<entry>
		<title type="html">When Your DbContext Has The Wrong Scope</title>
		<link href="https://test.com/archive/2023/01/09/scoping-db-context/" rel="alternate" type="text/html" title="Test Title"/>
		<published>2023-01-09T00:00:00+00:00</published>
		<updated>2023-01-09T00:00:00+00:00</updated>
		<id>https://test.com/archive/2023/01/09/scoping-db-context</id>
		<content type="html" xml:base="https://haacked.com/archive/2023/01/09/scoping-db-context/">
			<p>This is a test</p>
		</content>
		<author>
			<name>John Doe</name>
		</author>
		<category term="aspnetcore efcore"/>
		<summary type="html">This is a test</summary>
	</entry>
  <entry>
		<title type="html">When Your DbContext Has The Wrong Scope</title>
		<link href="https://test.com/archive/2023/01/09/texs/" rel="alternate" type="text/html" title="When Your DbContext Has The Wrong Scope"/>
		<published>2023-01-09T00:00:00+00:00</published>
		<updated>2023-01-09T00:00:00+00:00</updated>
		<id>https://test.com/archive/2023/01/09/scoping-db-context</id>
		<content type="html" xml:base="https://haacked.com/archive/2023/01/09/scoping-db-context/">
			<p>This is a test</p>
		</content>
		<author>
			<name>John Doe</name>
		</author>
		<category term="aspnetcore efcore"/>
		<summary type="html">This is a test</summary>
	</entry>
</feed>`,
    });

    const result = await fetchAndParseFeed("https://www.example.com/atom");
    expect(result).toEqual(
      expect.objectContaining({
        title: "A Test Title",
        items: expect.arrayContaining([
          expect.objectContaining({
            link: "https://test.com/archive/2023/01/09/scoping-db-context/",
          }),
        ]),
      })
    );
  });

  it("fetches a parsed a simple feed with a single entry", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: `\    
<feed
	xmlns="http://www.w3.org/2005/Atom">
	<generator uri="https://jekyllrb.com/" version="3.9.2">Jekyll</generator>
	<link href="https://test.com/atom.xml" rel="self" type="application/atom+xml"/>
	<link href="https://test.com/" rel="alternate" type="text/html"/>
	<updated>2023-01-20T15:53:17+00:00</updated>
	<id>https://test.com/atom.xml</id>
	<title type="html">A Test Title</title>
	<subtitle>A Test Sub-title</subtitle>
	<author>
		<name>John Doe</name>
	</author>
	<entry>
		<title type="html">When Your DbContext Has The Wrong Scope</title>
		<link href="https://test.com/archive/2023/01/09/scoping-db-context/" rel="alternate" type="text/html" title="Test Title"/>
		<published>2023-01-09T00:00:00+00:00</published>
		<updated>2023-01-09T00:00:00+00:00</updated>
		<id>https://test.com/archive/2023/01/09/scoping-db-context</id>
		<content type="html" xml:base="https://haacked.com/archive/2023/01/09/scoping-db-context/">
			<p>This is a test</p>
		</content>
		<author>
			<name>John Doe</name>
		</author>
		<category term="aspnetcore efcore"/>
		<summary type="html">This is a test</summary>
	</entry>
</feed>`,
    });

    const result = await fetchAndParseFeed("https://www.example.com/atom");    
    expect(result).toEqual(
      expect.objectContaining({
        title: "A Test Title",
        items: expect.arrayContaining([
          expect.objectContaining({
            link: "https://test.com/archive/2023/01/09/scoping-db-context/",
          }),
        ]),
      })
    );
  });
});
