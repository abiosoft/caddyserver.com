---
title: pprof
type: docs
directive: true
---

pprof publishes runtime profiling data at endpoints under /debug/pprof. You can visit /debug/pprof on your site for an index of the available endpoints.

<mark class="block">This is a debugging tool. Certain requests (such as collecting execution traces) can be slow. If you use pprof on a live site, consider restricting access or enabling it only temporarily.</mark>

For more information, please see [Go's pprof documentation](https://golang.org/pkg/net/http/pprof/) and read [Profiling Go Programs](https://blog.golang.org/profiling-go-programs).

### Syntax

<code class="block"><span class="hl-directive">pprof</span></code>

### Examples

Enable pprof endpoints:

<code class="block"><span class="hl-directive">pprof</span></code>
