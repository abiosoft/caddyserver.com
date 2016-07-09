---
title: fastcgi
type: docs
directive: true
---

fastcgi proxies requests to a FastCGI server. Even though the most common use for this directive is to serve PHP sites, it is by default a generic FastCGI proxy. This directive may be used multiple times with different request paths.

### Syntax

<code class="block"><span class="hl-directive">fastcgi</span> <span class="hl-arg"><i>path endpoint</i> [<i>preset</i>]</span> {
    <span class="hl-subdirective">ext</span>    <i>extension</i>
    <span class="hl-subdirective">split</span>  <i>splitval</i>
    <span class="hl-subdirective">index</span>  <i>indexfile</i>
    <span class="hl-subdirective">env</span>    <i>key value</i>
    <span class="hl-subdirective">except</span> <i>ignored_paths...</i>
}</code>

*   **path** is the base path to match before the request will be forwarded
*   **endpoint** is the address or Unix socket of the FastCGI server
*   **preset** is an optional preset name (see below)
*   **extension** specifies the extension which, if the request URL has it, would proxy the request to FastCGI
*   **splitval** specifies how to split the URL; the split value becomes the end of the first part and anything in the URL after it becomes part of the PATH_INFO CGI variable
*   **indexfile** specifies the default file to try if a file is not specified by the URL
*   **key value** sets an environment variable named _key_ with the given _value_; the **env** property can be used multiple times and values may use [request placeholders](/docs/placeholders)
*   **ignored_paths...** is a list of space-separated request paths to be excepted from fastcgi processing, even if it matches the base path

### Presets

This directive can be customized to work with a variety of FastCGI applications. To make things easier for proxying to common types of sites, some presets have been configured:

*   **php**  
    <code class="block"><span class="hl-subdirective">ext</span> .php
<span class="hl-subdirective">split</span> .php
<span class="hl-subdirective">index</span> index.php</code>

If a preset is used, its values can be overwritten if needed by declaring them manually inside the block.

### Examples

Proxy all requests to a FastCGI responder listening at 127.0.0.1:9000:

<code class="block"><span class="hl-directive">fastcgi</span> <span class="hl-arg">/ 127.0.0.1:9000</span></code>

Forward all requests in /blog to a PHP site (like WordPress) being served with php-fpm:

<code class="block"><span class="hl-directive">fastcgi</span> <span class="hl-arg">/blog/ 127.0.0.1:9000 php</span></code>

With custom FastCGI configuration:

<code class="block"><span class="hl-directive">fastcgi</span> <span class="hl-arg">/ 127.0.0.1:9001</span> {
	<span class="hl-subdirective">split</span> .html
}</code>

With PHP preset, but overriding the ext property:

<code class="block"><span class="hl-directive">fastcgi</span> <span class="hl-arg">/ 127.0.0.1:9001 php</span> {
	<span class="hl-subdirective">ext</span> .html
}</code>
