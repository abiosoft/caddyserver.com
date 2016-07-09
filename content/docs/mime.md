---
title: mime
type: docs
directive: true
---

mime sets the Content-Type in a response based on the file extension in the request.

Normally, Content-Type is detected automatically, but this is not always possible. If you encounter responses with the wrong Content-Type, you can use this middleware to correct it.

### Syntax

<code class="block"><span class="hl-directive">mime</span> <span class="hl-arg"><i>ext type</i></span></code>

*   **ext** is the file extension to match, including the dot prefix.
*   **type** is the Content-Type

If you have a lot of MIME types to set, open a block:

<code class="block"><span class="hl-directive">mime</span> {
	<i><span class="hl-subdirective">ext</span> type</i>
}
</code>

Each line defines a MIME extension-type pair. You can have as many lines as you need in a mime block.

### Examples

Customize the Content-Type of Flash files:

<code class="block"><span class="hl-directive">mime</span> <span class="hl-arg">.swf application/x-shockwave-flash</span></code>

For multiple files:

<code class="block"><span class="hl-directive">mime</span> {
	<span class="hl-subdirective">.swf</span> application/x-shockwave-flash
	<span class="hl-subdirective">.pdf</span> application/pdf
}</code>
