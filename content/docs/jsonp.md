---
title: jsonp
type: docs
directive: true
plugin: true
link: https://github.com/pschlump/caddy-jsonp
---

jsonp allows for JSONP GET requests. The GET must be returing JSON. If the query string contains a "callback" parameter, it will be wrapped in the callback function name.

This directive is not compatible with streaming calls.  This should not be a problem because streaming is not compatible with JSONP to start off with. JSONP requires that the complete set of data be in the parameters to the callback function.  Streaming only returns the data in chunks.

The code internally buffers the entire response in memory before sending it back.  Very large responses should be avoided.

### Syntax

<code class="block"><span class="hl-directive">jsonp</span> <span class="hl-arg"><i>path</i></span></code>

*   **path** is a path that will get converted to a JSONP response.

### Example

To have /api/status support JSONP:

<code class="block"><span class="hl-directive">jsonp</span> <span class="hl-arg">/api/status</span></code>

So for an endpoint that normally returns raw JSON like `{"status":"ok"}`, the following request:

<code class="block">$ wget 'http://<!-- -->example.com/api/status?callback=func3022933'</code>

would return `func3022933({"status":"ok"});`.
