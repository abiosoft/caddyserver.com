---
title: root
type: docs
directive: true
---

root simply specifies the root of the site. This is very useful, in fact required, if the root (/) directory of the website is not the same as where Caddy is being executed from.

The default root is the current working directory. A relative root path is relative to the current working directory.

### Syntax

<code class="block"><span class="hl-directive">root</span> <span class="hl-arg"><i>path</i></span></code>

*   **path** is the directory to set as the site root

### Examples

Serve the website out of Jake's public_html folder instead of the current working directory:

<code class="block"><span class="hl-directive">root</span> <span class="hl-arg">/home/jake/public_html</span></code>
