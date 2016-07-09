---
title: filemanager
type: docs
directive: true
plugin: true
link: https://github.com/hacdias/caddy-filemanager
---

filemanager is an extension based on browse middleware. It provides a file managing interface within the specified directory and it can be used to upload, delete, preview and rename your files within that directory.

![File Manager for Caddy](/resources/images/middleware/filemanager.png)

It is extremely important for security reasons to cover the path of filemanager with some kind of authentication. You can use, for example, [`basicauth`](/docs/basicauth) directive.

### Syntax

<code class="block"><span class="hl-directive">filemanager</span> </span> {
	<span class="hl-subdirective">show</span> 	<i>path</i>
	<span class="hl-subdirective">on</span> 		<i>url</i>
	<span class="hl-subdirective">styles</span> 	<i>filepath</i>
}</code>

*   **path** (optional) is the directory you want to be able to browse within. By default it is `./`.
*   **url** (optional) is the URL where you want to access the File Manager interface. By default it is `/`.
*   **styles** (optional) is the path to a file with costum styles.

### Examples

Show the directory where Caddy is being executed at the root of the domain:

<code class="block"><span class="hl-directive">filemanager</span></code>

Show the content of `foo` at the root of the domain:

<code class="block"><span class="hl-directive">filemanager</span> </span> {
	<span class="hl-subdirective">show</span> <i>foo/</i>
}</code>

Show the directory where Caddy is being executed at `/filemanager`:

<code class="block"><span class="hl-directive">filemanager</span> </span> {
	<span class="hl-subdirective">on</span> <i>/filemanager</i>
}</code>

Show the content of `foo` at `/bar`:

<code class="block"><span class="hl-directive">filemanager</span> </span> {
	<span class="hl-subdirective">show</span> 	<i>foo/</i>
	<span class="hl-subdirective">on</span> 		<i>/bar</i>
}</code>
