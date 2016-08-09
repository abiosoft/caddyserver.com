---
title: minify
type: docs
directive: true
plugin: true
link: https://github.com/hacdias/caddy-minify
---

minify enables minifying on your website. By default it will minify every css, javascript, html, svg, xml and json files. You can exclude some paths or single files so they're not minified.


### Syntax

<code class="block"><span class="hl-directive">minify</span> <span class="hl-arg"><i>paths...</i></span> {
	<span class="hl-subdirective">if</span>    <i>a cond b</i>
	<span class="hl-subdirective">if_op</span> <i>[</i>and|or<i>]</i>
	...
}
</code>

+ **paths** are space separated file paths to minify. If nothing is specified, the whole website will be minified.
+ **if** specifies a condition. Multiple ifs are AND-ed together by default. **a** and **b** are any string and may use [request placeholders](https://caddyserver.com/docs/placeholders). **cond** is the condition, with possible values explained in [rewrite](https://caddyserver.com/docs/rewrite#if) (which also has an `if` statement).
+ **if_op** specifies how the ifs are evaluated; the default is `and`.

### Examples

Minify all of the supported files of the website:

<code class="block"><span class="hl-directive">minify</span></code>

Only minify the contents of `/assets` folder:

<code class="block"><span class="hl-directive">minify</span> <span class="hl-arg">/assets</span></code>

Minify the whole website except `/api`:

<code class="block"><span class="hl-directive">minify</span> </span> {
	<span class="hl-subdirective">if</span> {path} not_match ^(\/api).*
}</code>

Minify the files of `/assets` folder except `/assets/js`:

<code class="block"><span class="hl-directive">minify</span> <span class="hl-arg">/assets</span></span> {
	<span class="hl-subdirective">if</span> {path} not_match ^(\/assets\/js).*
}</code>
