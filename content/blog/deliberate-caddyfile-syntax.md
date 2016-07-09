---
title: The Deliberate Caddyfile Syntax
author: Matt Holt
date: 2015-08-06 08:00:00+00:00
type: post
---

You may have rolled your eyes when you saw a new web server with another new configuration syntax. [The Caddyfile](https://caddyserver.com/docs/caddyfile) seems like a hybrid of NGINX conf, HAProxy conf, and Go syntax. But actually, designing the Caddyfile had nothing to do with borrowing from other languages. Instead, I tried to determine what would make the user enjoy their experience the most.

Perhaps first we should explain the purpose and goals of the Caddyfile, then answer the question about why none of the existing syntaxes were an ideal fit for Caddy.


## The Caddyfile

The Caddyfile is used to configure Caddy. Web server configurations are often prepared by hand, but Caddy is also deployable in automated environments where the configuration file is generated dynamically. The syntax of the Caddyfile, I believe, caters to both situations nicely.

To give you an idea, here is a real Caddyfile that configures three hosts (two sites):

<code class="block"><span class="hl-vhost">http://caddyserver.com, https://caddyserver.com</span> {
	<span class="hl-directive">tls</span>  <span class="hl-arg">"caddy bundle.crt" caddy.key</span>
	<span class="hl-directive">root</span> <span class="hl-arg">/www/caddyserver.com</span>
	<span class="hl-directive">ext</span>  <span class="hl-arg">.html .md</span>
	<span class="hl-directive">gzip</span>
	<span class="hl-directive">errors</span> {
		<span class="hl-subdirective">log</span> error.log
		<span class="hl-subdirective">404</span> 404.html
	}
	<span class="hl-directive">templates</span>
	<span class="hl-directive">proxy</span> <span class="hl-arg">/download/build localhost:5050</span>
	<span class="hl-directive">proxy</span> <span class="hl-arg">/features.json  localhost:5050</span>
}<br>
<span class="hl-vhost">http://matt.life</span> {
	<span class="hl-directive">root</span> <span class="hl-arg">/www/matt.life</span>
	<span class="hl-directive">ext</span>  <span class="hl-arg">.html</span>
	<span class="hl-directive">gzip</span>
}</code>

New syntax? Yes. Familiar? Yes. However, I want to emphasize that this is not an ideal general-purpose configuration syntax. It was made only for Caddy.

A few distinct features of the Caddyfile are: very low duplication, almost no punctuation, irrelevant extraneous whitespace, short and expressive keywords, and lists as keys.

- **Very Low Duplication:** The Caddyfile is designed to reduce identical, duplicate lines and reduce the amount of typing overall. [When we ported the Gopher Academy websites from nginx to Caddy](http://blog.gopheracademy.com/caddy-a-look-inside/), the config file went from 115 lines to just about 50. (We even added *git push* deployment to the file, whereas before a cron job was used to publish new posts.) It's not perfectly de-duplicated, but it's close.

- **Almost No Punctuation:** The only punctuation in the Caddyfile is curly braces, commas, and quotes; and all of them are optional. A minimal Caddyfile that serves just one site may not need any punctuation (except in the values themselves):
	<code class="block"><span class="hl-vhost">http://matt.life https://matt.life</span><br>
	<span class="hl-directive">root</span> <span class="hl-arg">/www/matt.life</span>
	<span class="hl-directive">ext</span>  <span class="hl-arg">.html</span>
	<span class="hl-directive">gzip</span></code>
This allows a Caddyfile to be written by a computer very easily. Each directive gets its own line, and arguments are space-separated. That's it. For convenience, addresses that declare a site may be followed by commas if you want to put the next one on a new line. If a value contains spaces or a newline, enclose it in quotes. This is familiar to almost anyone, and is very easy for newbies to learn. Quotes are ubiquitous and yet, in the Caddyfile, they are rare.

- **Irrelevant Extraneous Whitespace:** Whitespace does matter, but only for separating arguments/values, and all that's needed is a single whitespace character (more is okay). Line breaks are significant, making semicolons unnecessary. Most Caddyfile lines are fairly short, so this is not usually a problem. Indentation doesn't matter, but proper indentation is strongly recommended for legibility.

- **Short and Expressive Keywords:** The only keywords that appear in the Caddyfile are at the beginning of a line after the address(es) of the site. These keywords are usually directives, which invoke a feature of Caddy. We try hard to keep them unambiguous, intuitive, short, and informational so that you can look at it and know what it's doing. We even try to avoid underscores. Directives may also have properties or subdirectives as keywords, but those still appear at the beginning of a line and only have meaning within that directive, keeping the experience very consistent.

- **Lists as Keys:** This may be the most unusual feature of the Caddyfile. If you think of the Caddyfile as a map of host configurations keyed by address, then this makes sense. A single site block (set of directives) can configure any number of hosts at once, because the 'key' for that configuration can be multiple addresses. This is possible in other servers, too, but with Caddy it's more succinct and obvious.

With Caddyfile syntax, you can compose a web server by hand from scratch very easily. The learning curve is very gradual and short. Given that ease of configuration was a primary goal for Caddy, the Caddyfile is perhaps Caddy's most important user-facing feature.


## Other Formats

So why not use another syntax that others may be familiar with? Let's take a look.

### JSON, TOML, and YAML

These three popular formats are easy to serialize, two are easy to write by hand, and JSON especially is understood in nearly every application... except the Caddyfile. Why not?

JSON requires quite a bit of ceremony just to declare keys and values, which is about all it can do. JSON often gives way to deep nesting, which requires more cognitive overhead to write correctly. Sure, JSON serialization is ubiquitous, but there are too many quotes, brackets, braces, commas, and colons to worry about when writing by hand. Newbies often confuse JavaScript objects for JSON and end up with syntax errors. These and other reasons are why tools like [jsonlint.com](http://jsonlint.com) exist. JSON is convenient over-the-wire, but that's not the point of config files. No, I wanted the Caddyfile to be easily composable by a human being.

Another issue is structure. None of these formats allow you to use arrays as keys. The Caddyfile would have to be designed to name each configuration then reference it from elsewhere in order to prevent duplication. It was getting confusing in the design process, especially to people who aren't programmers.

TOML is a neat little declarative language. But it's not a good fit for Caddy because of its syntactic ceremony with required square brackets, quotes, commas, etc. TOML is certainly easier to write by hand than JSON, but when I want minimal cognitive overhead, I mean *minimal*.

Then there's YAML. YAML is fine, but it's actually a complicated syntax ([80 pages of specification glory](http://yaml.org/spec/1.2/spec.html)). Try explaining why spaces can be used for indentation but not tabs. I didn't want users to have to learn YAML and Caddy at the same time. This same reasoning applies to TOML and JSON, too. I still like writing YAML and TOML by hand more than JSON by hand, but they didn't make the cut.

### nginx.conf

Many NGINX users are fond of its configuration syntax, including myself. But I think I only appreciate it because I'm a programmer.

The most striking difference here is that nginx.conf has semicolons. It's true, semicolons at the ends of lines makes it easy to break up long lines at will. But... semicolons. Not all of Caddy's users are programmers, so requiring a semicolon seemed counter-productive. Besides, directives can be engineered to avoid long lines. So we went that route instead.

### HAProxy Conf

HAProxy has a very elegant, simple configuration syntax. The only reason I chose not to use it is its reliance on indentation. I think indentation is great for readability but enforcing it isn't so awesome, especially considering the nuances of different indentation preferences like tab vs. space, how many spaces, what if the spaces are inconsistent, etc. Just ask anyone who started using YAML only to find that spaces were required for indentation.


## Automated Environments

Even though there isn't a serialization directly from data structure to Caddyfile yet,  it's easy to generate a Caddyfile procedurally. Creating a Caddyfile from a computer program isn't hard because the syntax is so simple. We realize, however, that doing this is still burdensome in automated deployments, so we're actively working on ways to configure Caddy without the use of a configuration file. Once this is ready, Caddy will be configurable on-the-fly with a REST API&mdash;no configuration file needed.


## Getting Involved

We're passionate about making it easy to serve the Web. If you're a developer and want to help improve Caddy or create tooling around the Caddyfile, we have a great community and you should get on board. It's easy for any Go programmers to get involved, as there are tasks of every difficulty and level of immersion available. We also welcome programmers of other languages to create tooling or Caddy integrations. Check out the project issues on GitHub to get started, and feel free to ask questions!
