---
title: redir
type: docs
directive: true
---

redir sends the client an HTTP redirect status code if the URL matches the specified pattern. It is also possible to make a redirect conditional.

### Syntax

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg"><i>from to code</i></span></code>

*   **from** is the request path to match (it must match exactly)
*   **to** is the path to redirect to (may use [request placeholders](/docs/placeholders))
*   **code** is the HTTP status code to respond with; must be in the range [300-308] excluding 306\. May also be `meta` to issue meta tag redirect for browsers.

To create a "catch-all" redirect, omit the _from_ value:

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg"><i>to</i> [<i>code</i>]</span></code>

The default status code is 301 Moved Permanently.

If you have a lot of redirects, share a redirect code by making a table:

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg">[<i>code</i>]</span> {
	<span class="hl-subdirective"><i>from</i></span> <i>to</i> [<i>code</i>]
}
</code>

Each line defines a redirect and may optionally overwrite the redirect code defined at the top of the table. If no redirect code is specified, the default is used.

A group of redirects can also be conditional:

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg">[<i>code</i>]</span> {
	<span class="hl-subdirective">if</span>    <i>a cond b</i>
	<span class="hl-subdirective">if_op</span> <i>[</i>and|or<i>]</i>
	...
}
</code>

*   **if** specifies a rewrite condition. Multiple ifs are AND-ed together by default. **a** and **b** are any string and may use [request placeholders](/docs/placeholders). **cond** is the condition, with possible values explained in [rewrite](/docs/rewrite#if) (which also has an `if` statement).
*   **if_op** specifies how the ifs are evaluated; the default is `and`.

### Preserving Path

By default, redirects are from precisely matching paths to the precise location you've defined. You can preserve the path or other portions of the request URL by using [replaceable values](/docs/placeholders), such as {uri} or {path}, in any "to" argument. Only request placeholders are supported.

### Examples

When a request comes in for /resources/images/photo.jpg, redirect to /resources/images/drawing.jpg with HTTP 307 (Temporary Redirect) status code:

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg">/resources/images/photo.jpg /resources/images/drawing.jpg 307</span></code>

Redirect all requests to https://newsite.com while preserving the request URI:

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg">https://newsite.com{uri}</span></code>

Defining multiple redirections that share a 307 status code, except the last one:

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg">307</span> {
	<span class="hl-subdirective">/foo</span>     /info/foo
	<span class="hl-subdirective">/todo</span>    /notes
	<span class="hl-subdirective">/api-dev</span> /api       meta
}</code>

Redirect only if the forwarded protocol is HTTP:

<code class="block"><span class="hl-directive">redir</span> <span class="hl-arg">301</span> {
	<span class="hl-subdirective">if</span> {>X-Forwarded-Proto} is http
	<span class="hl-subdirective">/</span>  https://{host}{uri}
}</code>
