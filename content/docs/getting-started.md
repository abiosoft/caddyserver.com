---
title: Getting Started
type: docs
---

This page will help you get up and running with Caddy on your local machine or on a remote server. You'll want to be familiar with the command line since Caddy is not a visual application.

### Quick Start

1.  [Download Caddy](/download) for your platform and put it in your PATH.
2.  `cd` to the folder containing your website.
3.  Run `caddy`.

Open your browser to [http://localhost:2015](http://localhost:2015) to see it working.

If you see a message like "404 Not Found" then Caddy is working but the directory from which you are running Caddy probably doesn't have an index file (index.html).

### Configuring Caddy

Customize how Caddy serves your site by placing a text file called Caddyfile next to your site. You can actually name the file anything and put it anywhere, but this is the norm.

The first line of a Caddyfile is the address to listen on, for example:

<code class="block"><span class="hl-vhost">localhost:8080</span></code>

When you save that in a file called `Caddyfile`, Caddy will automatically find it when you start it:

```
$ caddy
```

If the Caddyfile is in a different location or has a different name, tell Caddy where it is:

```
$ caddy -conf="../path/to/Caddyfile"
```

The Caddyfile is really easy to use. Take a few minutes to learn the [syntax of the Caddyfile](/docs/caddyfile).
