---
title: bind
type: docs
directive: true
---

bind overrides the host to which the server should bind. Normally, the listener binds to the wildcard host. However, you may force the listener to bind to another hostname or IP instead. This directive accepts only a host, not a port.

Note that binding sites inconsistently may result in unintended consequences. For example, if two sites on the same port resolve to 127.0.0.1 and only one of those sites is configured with `bind 127.0.0.1`, then only one site will be accessible since the other will bind to the port without a specific host; the OS will choose the more specific matching socket. (Virtual hosts are not shared across different listeners.)

### Syntax

<code class="block"><span class="hl-directive">bind</span> <span class="hl-arg"><i>host</i></span></code>

*   **host** is the hostname (or IP address) to bind to

### Examples

To make your socket accessible only to that machine, bind to IP 127.0.0.1 (localhost):

<code class="block"><span class="hl-directive">bind</span> <span class="hl-arg">127.0.0.1</span></code>
