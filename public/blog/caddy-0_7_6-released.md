---
title: Caddy 0.7.6 Released
author: Matt Holt
date: 2015-09-29 08:00:00
---

This week, [Caddy 0.7.6](https://github.com/mholt/caddy/releases/tag/v0.7.6) is released ([download](/download)). It's been over a month since the last update but when you see why, you'll agree it was worth the wait. The latest version of Caddy is the result of many contributors' handiwork and not all the improvements are in the core; several are add-ons. Plus, we've begun laying the foundation for future Caddy features like Let's Encrypt; and other changes that aren't visible to the user.

## Credits

This release wouldn't be possible without work from contributors from all over the world: Abiola Ibrahim, Maxime Laserre, Alexander Morozov, Karthic Rao, Benoit Benedetti, Mathias Beke, Tamás Gulácsi, and Abdulelah Alfuntakh&mdash;and these are just contributors to core! Add-ons have been developed by Philip Schlump, Pedro Nasser, and Henrique Dias. Plus, a Let's Encrypt client is being implemented by Sebastian Erhart.

A very big thanks to all contributors!

## Changes

Here's the change list:

- Pass in simple Caddyfile as command line arguments
- basicauth: Support for legacy htpasswd files
- browse: JSON response with file listing
- core: Caddyfile as command line argument
- errors: Can write full stack trace to HTTP response for debugging
- errors, log: Roll log files after certain size or age
- proxy: Fix for 32-bit architectures
- rewrite: Better compatibility with fastcgi and PHP apps
- templates: Added .StripExt and .StripHTML methods
- Internal improvements and minor bug fixes

On the surface, this may not seem like much, and indeed they aren't huge changes. But let's look at a few.

### File Listing API

The `browse` directive now serves JSON responses when requests have "json" in their Accept header:


	[
	    {
	        "IsDir": false,
	        "Name": "common.js",
	        "Size": 705,
	        "URL": "resources/js/common.js",
	        "ModTime": "2015-07-30T10:47:07-06:00",
	        "Mode": 420
	    },
	    {
	        "IsDir": false,
	        "Name": "download.js",
	        "Size": 968,
	        "URL": "resources/js/download.js",
	        "ModTime": "2015-07-30T10:47:07-06:00",
	        "Mode": 420
	    }
	]

This essentially provides a JSON API to the file listings for front-end applications or web pages without being confined to HTML templates like before.


### Shorthand Caddyfile

You can now run Caddy with an ad-hoc, limited Caddyfile by tacking it onto the end of the `caddy` command. This is an even quicker way to get Caddy running with what you need.

Before this, if you wanted to start Caddy in a way that allowed users to browse files, you had to provide a full Caddyfile. Now, you can just type `caddy browse`. This starts Caddy with the default configuration, except the browse middleware is enabled.

Because this is intended for simple, temporary servers, there are some limitations. You cannot configure multiple servers, and each argument is interpreted as one line. That means if a line in your Caddyfile has quotes or special characters you need to enclose it in quotes `"`. You could, for example, do this:

	caddy "root public/" "browse" "templates /" "ext .html"

But as you need more directives, it's easier to just pipe in a Caddyfile or put one on the disk. Also, if you run Caddy this way, any Caddyfile on the disk in the same folder will be ignored, since Caddy gives preference to command line args and piped input.


### Log Rolling

The `errors` and `log` directives now support log rolling, so as your log files get big, they will be automatically maintained if you enable this feature. We haven't opted to make this the default behavior at this time, but we will in the future as we agree upon a sensible default.

Configuring log rolling is fairly straightforward:

<code class="block"><span class="hl-directive">log</span> <span class="hl-arg">access.log</span> {
	<span class="hl-subdirective">rotate</span> {
		<span class="hl-subdirective">size</span> 100 <span class="hl-comment"># Rotate after 100 MB</span>
		<span class="hl-subdirective">age</span>  14  <span class="hl-comment"># Keep log files for 14 days</span>
		<span class="hl-subdirective">keep</span> 10  <span class="hl-comment"># Keep at most 10 log files</span>
	}
}</code>

You can also enable log rolling in the `errors` directive in a similar manner. See the [docs](/docs/errors) for more details.

I anticipate that by version 1.0, log rolling will be a default behavior so you won't have to worry about this.

### Three New Add-ons

This week we've also released three new add-ons for Caddy, all independently developed. They are [jsonp](/docs/jsonp), [cms](/docs/cms), and [search](/docs/search).

**jsonp** wraps regular JSON responses with a callback if one was provided in the query string.

**cms** is a fully-featured static site manager with a web-based admin interface that, by default, ships with [Hugo](https://gohugo.io) (no need to install or run it separately). But you can also run jekyll and other commands with this add-on.

![The cms middleware](/resources/images/blog/cms-preview.png)

**search** is a self-contained site search. By default, it exposes a search page at /search and also has a JSON API if you want to write your own front-end. You can also customize the search page with your own HTML template.

![The search middleware](/resources/images/blog/search-preview.png)


## Let's Encrypt Has Started

We're making progress on integrating [Let's Encrypt](https://letsencrypt.org). Sebastian Erhart is actively developing a Go client library and this week, for the first time, I used it in Caddy to automatically generate a certificate at startup.

This is important because we fully intend to make HTTPS the *default* for websites. Even though the site owner will be required to supply an email address and accept the Let's Encrypt Subscriber Agreement, great care is being taken to ensure that your workflow is as minimally disrupted as possible. Expect 2016 to be the year of the HTTPS-default.


## Other Improvements and Future

The rest are bug fixes or preparations for future work. We've moved some code around internally and updated the build server to handle the needs of new add-ons, like running `go generate` before each build. Also some minor improvements to the website and blog.

We have quite a slew of refinements to make to what we already have, so the next few releases will probably be smaller and less interesting as far as new features go.

Truly, working on Caddy is a joy for all of us and we hope you'll find it useful. Please feel free to [contribute your own talents](https://github.com/mholt/caddy), [donate](/donate) to support the project, and let others know you're using it!

