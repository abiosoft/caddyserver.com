---
title: expvar
type: docs
directive: true
---

expvar exposes variables about the runtime or current process state in JSON format. The default endpoint is /debug/vars. By default, it reports memory statistics, the command used to run Caddy, and the number of goroutines.

<mark class="block">This is a debugging tool. Although it is usually safe to use this on live sites, take care that you do not reveal anything sensitive. Also note that plugins may add to the list of values that are published.</mark>

For more information, please see [Go's expvar documentation](https://golang.org/pkg/expvar/).

### Syntax

<code class="block"><span class="hl-directive">expvar</span> <span class="hl-arg">[<i>path</i>]</span></code>

*   **path** is the endpoint at which to serve the variables. Default is /debug/vars.

### Examples

Enable expvar at the default path:

<code class="block"><span class="hl-directive">expvar</span></code>

Enable expvar at a custom path:

<code class="block"><span class="hl-directive">expvar</span> <span class="hl-arg">/stats</span></code>
