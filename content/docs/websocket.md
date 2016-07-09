---
title: websocket
type: docs
directive: true
---

websocket facilitates a [WebSocket](https://developer.mozilla.org/en-US/docs/WebSockets) server/proxy. A command is executed when a new [WebSocket connection](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications) is made and Caddy relays the client's connection to the command.

Any command can be executed as long as it takes input from stdin and writes to stdout, as this is how it will communicate with the WebSocket client. The command does not need to know that it is talking to a Web Socket client; just use stdin and stdout.

Caddy will not make any effort to keep the backend process alive while a client is connected. It is the developer's responsibility to ensure the program does not terminate until the client is ready to close the connection or would be ready for it to terminate.

<mark class="block">Note that HTTP/2 does not support protocol upgrade, so you will have to disable HTTP/2 in order to use this directive successfully on secure connections.</mark>

### Syntax

<code class="block"><span class="hl-directive">websocket</span> <span class="hl-arg">[<i>path</i>] <i>command</i></span></code>

*   **path** is the base path to match with the request URL
*   **command** is the command to execute

If path is omitted, a default path of / is assumed (meaning all requests).

### Examples

Simple WebSockets echo server:

<code class="block"><span class="hl-directive">websocket</span> <span class="hl-arg">/echo cat</span></code>
