---
title: Caddy 0.8.1 Released
author: Matt Holt
date: 2016-01-12 08:00:00
---


Caddy 0.8.1 [spans over 100 commits](https://github.com/mholt/caddy/compare/v0.8.0...v0.8.1) and fixes all known issues introduced in 0.8 as well as many other bugs that were reported in the issue tracker. Although nothing critical was patched, we recommend that all Caddy users upgrade as soon as possible. See [the detailed change list](https://github.com/mholt/caddy/releases/tag/v0.8.1).

Even though most changes were internal, there's a few new features, too.

## New browse template

Browse's new default template looks nicer and is easier to use. It takes full advantage of the width of the screen with a pleasant amount of padding and light lines to guide your eye. The old browse template used Unicode icons which only rendered on some systems, but this new template uses SVG graphics that look sharp on every display and render in every modern browser.

![New browse template](/resources/images/blog/new-browse-template.png)

It's also easier to navigate. As always, you can use your browser's Back button to go up a level, but you can also click anywhere in the path to be taken directly to that folder:

<img src="/resources/images/blog/new-browse-nav.png" alt="New browse navigation" style="max-width: 350px; margin-left: auto; margin-right: auto; display: block;">

We will continue to refine and enhance the browse template over time.


## Glob import

You can now [import](/docs/import) multiple files at once into a single Caddyfile using glob patterns. For example, this Caddyfile will import and use any files found in the "vhosts" folder:

<code class="block"><span class="hl-directive">import</span>  <span class="hl-arg">vhosts/*</span></code>

The `import` directive is a special one that can appear outside a server block. This makes it possible for you to add and remove hosts on-the-fly just by adding files to a folder and reload the config with USR1.


## More powerful rewrites

The [rewrite](/docs/rewrite) directive has powerful new matching capabilities including conditions, regex captures, and custom status code responses. We still allow the simple "from-->to" rewrite rules, but advanced users can use these new features to make Caddy more compatible with overly-complex backends.

For example, you can rewrite based on User-Agent header values:

<code class="block"><span class="hl-directive">rewrite</span> {
     <span class="hl-subdirective">if</span> {>User-Agent} has iPhone
     <span class="hl-subdirective">to</span> /mobile{uri}
}</code>

You can also do something similar to the `try_files` of NGINX. At this point we'll point you to [the docs for rewrite](/docs/rewrite) if you're interested in learning more.

## Thanks

This release brought to you by myself, Abiola Ibrahim, Radim Marek, Mathias Beke, David Darrell, Pavel Pavlenko, and Ben Schumacher. Thanks to all who contributed, and enjoy this new release!

If you use Caddy, would you please consider [donating](/donate)? We'll love you forever!
