---
title: The Caddyfile
type: docs
---

This page describes how to configure Caddy using the Caddyfile.

### Introduction

The term "Caddyfile" describes a text file that changes how Caddy works. It's similar in purpose to httpd.conf or nginx.conf. The Caddyfile file can be named anything, but by default, Caddy will look for a file called Caddyfile in the current directory. You can specify another location for the Caddyfile using the `-conf` [flag](/docs/cli):

```
$ caddy -conf="/path/to/Caddyfile"
```

If your Caddyfile is within the root of your site, don't worry. Caddy will respond with "404 Not Found" to keep it hidden for you.

### Syntax

The Caddyfile always starts with the address of the site to serve:

<code class="block"><span class="hl-vhost">localhost:2020</span></code>

After that, each line is expected to start with a valid _directive_. Directives are keywords that are recognized by Caddy, like `gzip`:

<code class="block"><span class="hl-vhost">localhost:2020</span>
<span class="hl-directive">gzip</span></code>

Directives usually have one or more arguments after them:

<code class="block"><span class="hl-vhost">localhost:2020</span>
<span class="hl-directive">gzip</span>
<span class="hl-directive">log</span> <span class="hl-arg">../access.log</span></code>

Some directives may need more configuration than can fit easily on one line. As such, the syntax of a directive may permit you to open a block and set more parameters. The open curly brace must be at the end of a line:

<code class="block"><span class="hl-vhost">localhost:2020</span>
<span class="hl-directive">gzip</span>
<span class="hl-directive">log</span> <span class="hl-arg">../access.log</span>
<span class="hl-directive">markdown</span> <span class="hl-arg">/blog</span> {
    <span class="hl-subdirective">css</span> /blog.css
    <span class="hl-subdirective">js</span>  /scripts.js
}</code>

If the directive block is left empty, you should omit the curly braces entirely.

Arguments that contain whitespace must be enclosed in quotes `"`.

The Caddyfile can also have comments starting with the `#` character:

<code class="block"><span class="hl-comment"># Comments can start a line</span>
<span class="hl-directive">foobar</span> <span class="hl-comment"># or go at the end</span></code>

To configure multiple servers (virtual hosts) with a single Caddyfile, you must use curly braces around the site block:

<code class="block"><span class="hl-vhost">mysite.com</span> {
	<span class="hl-directive">root</span> <span class="hl-arg">/www/mysite.com</span>
}

<span class="hl-vhost">sub.mysite.com</span> {
	<span class="hl-directive">root</span> <span class="hl-arg">/www/sub.mysite.com</span>
	<span class="hl-directive">gzip</span>
	<span class="hl-directive">log</span> <span class="hl-arg">../access.log</span>
}</code>

As with directives, the open curly brace must be at the end of the same line. The closing curly brace must be on its own line.

For sites which share the same configuration, specify multiple addresses:

<code class="block"><span class="hl-vhost">localhost:2020, https://site.com, http://mysite.com</span> {
	...
}</code>

Site addresses also be defined under a specific path, or have wildcards in place of domain labels from the left side:

<code class="block"><span class="hl-vhost">example.com/static</span>
<span class="hl-vhost">*.example.com</span></code>

Power users may wish to use environment variables. This is allowed in addresses and arguments. They must be enclosed in curly braces, and you can use either Unix or Windows variable formats:

<code class="block"><span class="hl-vhost">localhost:{$PORT}</span>
<span class="hl-directive">root</span> <span class="hl-arg">{%SITE_ROOT%}</span></code>

### Addresses

Addresses are specified in the form <code><span class="hl-vhost">scheme</span>://<span class="hl-vhost">host</span>:<span class="hl-vhost">port</span></code>, where all but one are optional. The host portion is usually localhost or the domain name. The default port is 2015 (unless the site qualifies for [automatic HTTPS](/docs/automatic-https), in which case it's 443). The scheme portion is another way to specify a port. Valid schemes are "http" or "https" which represent, respectively, ports 80 and 443\. If both a scheme and port are specified, the port will override the scheme. For example:

<code class="block"><span class="hl-vhost">:2015</span>                    <span class="hl-comment"># Host: &lt;any&gt;, Port: 2015</span>
<span class="hl-vhost">localhost</span>                <span class="hl-comment"># Host: localhost, Port: 2015</span>
<span class="hl-vhost">localhost:8080</span>           <span class="hl-comment"># Host: localhost, Port: 8080</span>
<span class="hl-vhost">example.com</span>              <span class="hl-comment"># Host: example.com, Port: 443</span>
<span class="hl-vhost">http://example.com</span>       <span class="hl-comment"># Host: example.com, Port: 80</span>
<span class="hl-vhost">https://example.com</span>      <span class="hl-comment"># Host: example.com, Port: 443</span>
<span class="hl-vhost">http://example.com:1234</span>  <span class="hl-comment"># Host: example.com, Port: 1234</span>
</code>

### Directives

Each line in a server block must start with a valid directive. The order they appear in does not matter. A directive is the first word of a line, and it may be followed by arguments, which are extra values used to configure the directive. A directive may also open a block to specify more parameters.

Most directives invoke a layer of middleware. Middleware is a small layer in the application that handles HTTP requests and does one thing really well. Middleware are chained together (pre-compiled, if you will) at startup. Only middleware handlers which are invoked from the Caddyfile will be chained in, so small Caddyfiles are very fast and efficient.

The syntax of arguments varies from directive to directive. Some have required arguments, others don't. Consult the documentation of each directive for their signatures.

### Path Matching

Some directives accept an argument that specifies a _base path_ to match. A base path is a prefix, so if the URL starts with the base path, it will be a match. For example, a base path of `/foo` will match requests to `/foo`, `/foo.html`, `/foobar`, and `/foo/bar.html`. If you want to limit a base path to match a specific directory only, then suffix it with a forward slash like `/foo/`, which will _not_ match `/foobar`.
