import axios from "axios";
import { fetchAndParseFeed } from "../src/main";

jest.mock("axios");

describe("rss", () => {
  it("fetches a parsed a simple feed with multiple entries", async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: `\    
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
	<title>Geeky Tidbits</title>
	<description>Tidbits on software development, technology, and other geeky stuff</description>
	<link>https://www.geekytidbits.com</link>
	<atom:link href="https://www.geekytidbits.com/rss.xml" rel="self" type="application/rss+xml"/>
	<lastBuildDate>Tue, 03 Jan 2023 22:38:08 +0000</lastBuildDate>
	<item>
		<title>Playing with SvelteKit and Cloudflare Pages</title>
		<description>
			<![CDATA[ <p>SvelteKit is a web framework I’ve been keeping my eye on. Sure, it builds upon Svelte, but there is a lot more to it. It uses <a href="https://vitejs.dev/config/">Vite</a> for build tooling, has a simple file-based routing system, and allows you to build “Transitional Web Apps”, as Rich Harris calls them in his <a href="https://www.youtube.com/watch?v=860d8usGC0o">Have Single-Page Apps Ruined the Web?</a> talk from Jamstack Conf 2021. I think at first glace it looks like a great framework for building web apps.</p><p>Since it just hit <a href="https://svelte.dev/blog/announcing-sveltekit-1.0">v1.0</a> I thought now would be a good time to play with it. I’ve also been learning more about Cloudflare Workers, Pages, KV, etc. and decided I would like to build a simple web app using SvelteKit and deploy it to Cloudflare Pages.</p><p>The result of my playing is simple app template that implements user authentication. You can register a new user, login with a new registration, initiate a Forgot Password flow including sending a reset email. You can see the GitHub repo here: <a href="https://github.com/bradymholt/sveltekit-auth-template">https://github.com/bradymholt/sveltekit-auth-template</a> and the live site here: <a href="https://sveltekit-auth-template.pages.dev/">https://sveltekit-auth-template.pages.dev/</a>.</p><p><img src="/playing-with-sveltekit-on-cloudflare-pages/template.png" alt="SvelteKit Auth Template"></p><p>Things I learned and worked with while building this template:</p><ul><li>How to create JWTs on Cloudflare Workers</li><li>How to use <a href="https://developers.cloudflare.com/workers/learning/how-kv-works/">KV</a>, Cloudflare’s key value store</li><li>Sending emails with <a href="https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/">MailChannels</a></li><li>Validation with <a href="https://github.com/colinhacks/zod">zod</a></li><li>TailwindCSS - although I initially used Tailwind I changed my mind and removed it. But, I took it for a spin and learned a bit about it.</li><li>Self-hosting web fonts</li><li>PostCSS - I haven’t done much with PostCSS before but I was able to play with it and in particular, use the “postcss-nested” plugin to get nested CSS working without having to use Sass or Less.</li></ul> ]]>
		</description>
		<pubDate>Tue, 03 Jan 2023 00:00:00 +0000</pubDate>
		<link>https://www.geekytidbits.com/playing-with-sveltekit-on-cloudflare-pages/</link>
		<guid isPermaLink="true">https://www.geekytidbits.com/playing-with-sveltekit-on-cloudflare-pages/</guid>
	</item>
	<item>
		<title>Daily WTF JavaScript</title>
		<description>
			<![CDATA[ <p>I have been itching to build something recently. In the not so distant past when I’ve had this desire I ended up building a project template as a way to learn some new things and create a scaffold for a project I might tackle in the future. But, this time I decided I want to build something that I could actually publish.</p><p>What I ended up building is silly and trivial but it was fun: <a href="https://dailywtfjs.geekytidbits.com/">Daily WTF JavaScript</a> - a site that displays a daily rotating snippet of JavaScript that makes you say “WTF!”. Yes, there are no shortage of examples.</p><p><img src="/daily-wtf-javascript/wtfjs.png" alt="Daily WTF JavaScript"></p><p>As always when building things, I learned plenty:</p><ul><li><a href="https://vitejs.dev/">Vite</a> - I used Vite as a build tool and wow was I impressed. This felt so much better than using webpack or one of its derivatives.</li><li><code>place-items: center;</code> for centering an HTML element horizontally and vertically</li><li>GitHub Actions with GitHub Pages - My <a href="https://github.com/bradymholt/daily-wtf-js/blob/main/.github/workflows/gh-pages.yml">workflow</a> to publish the site to GitHub Pages uses GitHub Actions, which is the new generation method for working with pages. I can now use this template as a baseline for other projects.</li><li>Although I’ve used <a href="https://github.com/jsdom/jsdom">jsdom</a> before, it’s been awhile and I was able to reintroduce myself to its usefulness to parse HTML on the server side.</li><li>I was exposed to the wonderful world of <a href="https://cssgradient.io/swatches/">CSS Gradient Swatches</a>.</li><li>I learned more about <a href="https://postcss.org/">PostCSS</a> and want to continue learning and using it further.</li></ul> ]]>
		</description>
		<pubDate>Thu, 15 Dec 2022 00:00:00 +0000</pubDate>
		<link>https://www.geekytidbits.com/daily-wtf-javascript/</link>
		<guid isPermaLink="true">https://www.geekytidbits.com/daily-wtf-javascript/</guid>
	</item>
</channel>
</rss>`,
    });

    const result = await fetchAndParseFeed("https://www.example.com/atom");
    expect(result).toEqual(
      expect.objectContaining({
        title: "Geeky Tidbits",
        items: expect.arrayContaining([
          expect.objectContaining({
            link: "https://www.geekytidbits.com/daily-wtf-javascript/",
          }),
        ]),
      })
    );
  });

  it("fetches a parsed a simple feed with a single entry", async () => {
		axios.get = jest.fn().mockResolvedValue({
      data: `\    
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
	<title>Geeky Tidbits</title>
	<description>Tidbits on software development, technology, and other geeky stuff</description>
	<link>https://www.geekytidbits.com</link>
	<atom:link href="https://www.geekytidbits.com/rss.xml" rel="self" type="application/rss+xml"/>
	<lastBuildDate>Tue, 03 Jan 2023 22:38:08 +0000</lastBuildDate>
	<item>
		<title>Playing with SvelteKit and Cloudflare Pages</title>
		<description>
			<![CDATA[ <p>SvelteKit is a web framework I’ve been keeping my eye on. Sure, it builds upon Svelte, but there is a lot more to it. It uses <a href="https://vitejs.dev/config/">Vite</a> for build tooling, has a simple file-based routing system, and allows you to build “Transitional Web Apps”, as Rich Harris calls them in his <a href="https://www.youtube.com/watch?v=860d8usGC0o">Have Single-Page Apps Ruined the Web?</a> talk from Jamstack Conf 2021. I think at first glace it looks like a great framework for building web apps.</p><p>Since it just hit <a href="https://svelte.dev/blog/announcing-sveltekit-1.0">v1.0</a> I thought now would be a good time to play with it. I’ve also been learning more about Cloudflare Workers, Pages, KV, etc. and decided I would like to build a simple web app using SvelteKit and deploy it to Cloudflare Pages.</p><p>The result of my playing is simple app template that implements user authentication. You can register a new user, login with a new registration, initiate a Forgot Password flow including sending a reset email. You can see the GitHub repo here: <a href="https://github.com/bradymholt/sveltekit-auth-template">https://github.com/bradymholt/sveltekit-auth-template</a> and the live site here: <a href="https://sveltekit-auth-template.pages.dev/">https://sveltekit-auth-template.pages.dev/</a>.</p><p><img src="/playing-with-sveltekit-on-cloudflare-pages/template.png" alt="SvelteKit Auth Template"></p><p>Things I learned and worked with while building this template:</p><ul><li>How to create JWTs on Cloudflare Workers</li><li>How to use <a href="https://developers.cloudflare.com/workers/learning/how-kv-works/">KV</a>, Cloudflare’s key value store</li><li>Sending emails with <a href="https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/">MailChannels</a></li><li>Validation with <a href="https://github.com/colinhacks/zod">zod</a></li><li>TailwindCSS - although I initially used Tailwind I changed my mind and removed it. But, I took it for a spin and learned a bit about it.</li><li>Self-hosting web fonts</li><li>PostCSS - I haven’t done much with PostCSS before but I was able to play with it and in particular, use the “postcss-nested” plugin to get nested CSS working without having to use Sass or Less.</li></ul> ]]>
		</description>
		<pubDate>Tue, 03 Jan 2023 00:00:00 +0000</pubDate>
		<link>https://www.geekytidbits.com/playing-with-sveltekit-on-cloudflare-pages/</link>
		<guid isPermaLink="true">https://www.geekytidbits.com/playing-with-sveltekit-on-cloudflare-pages/</guid>
	</item>	
</channel>
</rss>`,
    });

    const result = await fetchAndParseFeed("https://www.example.com/atom");
    expect(result).toEqual(
      expect.objectContaining({
        title: "Geeky Tidbits",
        items: expect.arrayContaining([
          expect.objectContaining({
            link: "https://www.geekytidbits.com/playing-with-sveltekit-on-cloudflare-pages/",
          }),
        ]),
      })
    );
  });
});
