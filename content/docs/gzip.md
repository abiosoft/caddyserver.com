---
title: gzip
type: docs
directive: true
---

gzip enables gzip compression if the client supports it. By default, responses are not gzipped. If enabled, the default settings will ensure that images, videos, and archives (already compressed) are not gzipped.

### Syntax

<code class="block"><span class="hl-directive">gzip</span></span></code>

The plain gzip config is good enough for most things, but you can gain more control if needed:

<code class="block"><span class="hl-directive">gzip</span> {
    <span class="hl-subdirective">ext</span>        <i>extensions...</i>
    <span class="hl-subdirective">not</span>        <i>paths</i>
    <span class="hl-subdirective">level</span>      <i>compression_level</i>
    <span class="hl-subdirective">min_length</span> <i>min_bytes</i>
}</code>

*   **extensions...** is a space-separated list of file extensions to compress. Supports wildcard `*` to match all extensions.
*   **paths** is a space-separated list of paths in which _not_ to compress.
*   **compression_level** is a number from 1 (best speed) to 9 (best compression). Default is 9.
*   **min_bytes** is the minimum number of bytes in a response needed before compression will happen. Default is no minimum length.

### Examples

Enable gzip compression:

<code class="block"><span class="hl-directive">gzip</span></code>

Enable very fast but minimal compression except in the /images and /videos folders (note, however, that images and videos will not be gzipped anyway):

<code class="block"><span class="hl-directive">gzip</span> {
	<span class="hl-subdirective">level</span> 1
	<span class="hl-subdirective">not</span>   /images /videos
}</code>
