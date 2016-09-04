---
title: header
type: docs
directive: true
---

header can manipulate response headers.

Note that if you wish to remove response headers from a proxied backend, you must do so in the <a href="/docs/proxy">proxy</a> directive.

### Syntax

<code class="block"><span class="hl-directive">header</span> <span class="hl-arg"><i>path name value</i></span></code>

*   **path** is the base path to match.
*   **name** is the name of the field. Prefix with a hyphen (`-`) to remove the header or a plus (`+`) to append instead of overwrite.
*   **value** is the value for the field. Dynamic values can also be inserted using [placeholders](/docs/placeholders).

This directive can be used multiple times, or you can group multiple custom header fields for the same path:

<code class="block"><span class="hl-directive">header</span> <span class="hl-arg"><i>path</i></span> {
    <span class="hl-subdirective"><i>name</i></span> <i>value</i>
}</code>

### Examples

Custom header for all pages:

<code class="block"><span class="hl-directive">header</span> <span class="hl-arg">/ X-Custom-Header "My value"</span></code>

Strip the "Hidden" field from header:

<code class="block"><span class="hl-directive">header</span> <span class="hl-arg">/ -Hidden</span></code>

Multiple custom headers for a specific path, while removing the Server field:

<code class="block"><span class="hl-directive">header</span> <span class="hl-arg">/api</span> {
    <span class="hl-subdirective">Access-Control-Allow-Origin</span>  *
    <span class="hl-subdirective">Access-Control-Allow-Methods</span> "GET, POST, OPTIONS"
    <span class="hl-subdirective">-Server</span>
}</code>


Add some security headers to all pages:


<code class="block"><span class="hl-directive">header</span> <span class="hl-arg">/</span> {
    <span class="hl-comment"># Enable HTTP Strict Transport Security (HSTS) to force clients to always</span>
    <span class="hl-comment"># connect via HTTPS (do not use if only testing)</span>
    <span class="hl-subdirective">Strict-Transport-Security</span> "max-age=31536000;"
    <span class="hl-comment"># Enable cross-site filter (XSS) and tell browser to block detected attacks</span>
    <span class="hl-subdirective">X-XSS-Protection</span> "1; mode=block"
    <span class="hl-comment"># Prevent some browsers from MIME-sniffing a response away from the declared Content-Type</span>
    <span class="hl-subdirective">X-Content-Type-Options</span> "nosniff"
    <span class="hl-comment"># Disallow the site to be rendered within a frame (clickjacking protection)</span>
    <span class="hl-subdirective">X-Frame-Options</span> "DENY"
}</code>
