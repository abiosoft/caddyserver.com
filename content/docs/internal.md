---
title: internal
type: docs
directive: true
---

internal protects all resources in the specified directory from external requests. Browsers (or any client) that directly requests a resource in the protected directory will receive a 404 Not Found status.

Because this directive supports the X-Accel-Redirect header, it is often used in conjunction with a backend proxy. Requests to a different URL than the internal one may be redirected to a proxy, which can set the X-Accel-Redirect header. When Caddy sees this coming from the proxy, it will allow access to the internal resource and send it to the client. This is also known sometimes as X-Sendfile.

This pattern handling requests allows a backend proxy to perform logging, authentication, and other things without the client having to deal with redirects.

### Syntax

<code class="block"><span class="hl-directive">internal</span> <span class="hl-arg"><i>path</i></span></code>

*   **path** is the base path to protect from external requests

### Examples

To protect all contents of /internal from being served directly:

<code class="block"><span class="hl-directive">internal</span> <span class="hl-arg">/internal</span></code>

Part of an example Caddyfile that protects some resources but allows a proxy to grant access to them (the service listening on :9000 must set X-Accel-Redirect):

<code class="block"><span class="hl-directive">internal</span> <span class="hl-arg">/internal</span>
<span class="hl-directive">proxy</span>    <span class="hl-arg">/redirect http://localhost:9000</span></code>
