---
title: minify
type: docs
directive: true
plugin: true
link: https://github.com/hacdias/caddy-minify
---

minify enables minifying on your website. By default it will minify every css, javascript, html, svg, xml and json files. You can exclude some paths or single files so they're not minified.


### Syntax

<code class="block"><span class="hl-directive">minify</span> </span> {
	<span class="hl-subdirective">only</span> <i>foo...</i>
	<span class="hl-subdirective">exclude</span> <i>bar...</i>
}</code>

*   **foo** (optional) are space separated single file paths or folders to include on minifying. By default the whole website will be minified. If this directive is set, only the files on the specified paths will be minified.
*   **bar** (optional) are space separated single file paths or folders to exclude from minifying.

### Examples

Minify all of the supported files of the website:

<code class="block"><span class="hl-directive">minify</span></code>

Only minify the contents of `/assets` folder:

<code class="block"><span class="hl-directive">minify</span> </span> {
	<span class="hl-subdirective">only</span> <i>/assets</i>
}</code>

Minify the whole website except `/api`:

<code class="block"><span class="hl-directive">minify</span> </span> {
	<span class="hl-subdirective">exclude</span> <i>/api</i>
}</code>

Minify the files of `/assets` folder except `/assets/js`:

<code class="block"><span class="hl-directive">minify</span> </span> {
	<span class="hl-subdirective">only</span> <i>/assets</i>
	<span class="hl-subdirective">exclude</span> <i>/assets/js</i>
}</code>
