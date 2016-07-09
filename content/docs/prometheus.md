---
title: prometheus
type: docs
directive: true
plugin: true
link: https://github.com/miekg/caddy-prometheus
---

prometheus integrates [Prometheus monitoring metrics](http://prometheus.io/) for your site.

It exports four metrics: caddy_http_request_count_total, caddy_http_request_duration_seconds, caddy_http_response_size_bytes, and caddy_http_response_status_count_total. The metrics are available at /metrics on the address you specify in the Caddyfile.

### Syntax

<code class="block"><span class="hl-directive">prometheus</span> <span class="hl-arg">[<i>address</i>]</span> {
	<span class="hl-subdirective">address</span> <i>address</i>
}</code>

*   **address** the address the prometheus HTTP server listens on (default is localhost:9180).

### Examples

Export metrics at default address:

<code class="block"><span class="hl-directive">prometheus</span></code>

Listen on a different address:

<code class="block"><span class="hl-directive">prometheus</span> <span class="hl-arg">localhost:2020</span></code>
