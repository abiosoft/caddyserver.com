---
title: startup
type: docs
directive: true
---

startup executes a command when the server begins. This is useful for preparing to serve a site by running a script or starting a background process like php-fpm. (Also see [shutdown](/docs/shutdown).)

Each command that is executed at startup is blocking, unless you suffix the command with a space and `&`, which will cause the command to be run in the background. The output and error of the command go to stdout and stderr, respectively. There is no stdin.

Even if this directive is shared by more than one host, the command will only execute once.

### Syntax

<code class="block"><span class="hl-directive">startup</span> <span class="hl-arg"><i>command</i></span></code>

*   **command** is the command to execute; it may be followed by arguments

### Examples

Start php-fpm before the server starts listening:

<code class="block"><span class="hl-directive">startup</span> <span class="hl-arg">/etc/init.d/php-fpm start</span></code>
