{
	"title":"RealIP",
	"addonRepo": "github.com/captncraig/caddy-realip"
}

The real IP module is useful in situations where you are running caddy behind a proxy server.
In these situations the actual client ip will be stored in an HTTP header, usually `X-Forwarded-For`. The problem this creates
is that other directives that rely on the client ip address, like [ipfilter](./ipfilter) or [git](./git), will not always work properly in these scenarios.

This middleware will seamlessly and securely read the real ip adress from the appropriate header and store it in the request so that
any downstream directives will see the real client IP address in `request.RemoteAddr`.

### Syntax

<code class="block"><span class="hl-directive">realip</span> {
    <span class="hl-subdirective">header</span> <i>name</i>
	<span class="hl-subdirective">from</span> <i>cidr</i>
}
</code>

- **name** is the name of the header containing the actual IP address. Default is `X-Forwarded-For`.
- **cidr** is the address range of expected proxy servers. As a security measure, IP headers are only accepted from known proxy servers. Must be a valid cidr block notation. This may be specified multiple times.

### CIDR blocks
CIDR is a standard notation for specifying IP ranges. To allow a single IP, use `/32` after the ip to specify no mask: `123.222.31.4/32`. To allow ALL Ips (and accept an `X-Forwarded-For` header from anybody), use `0.0.0.0/0`. Most cloud services should have their ip ranges published in this format somewhere.

### Examples

Simple usage to read `X-Forwarded-For` from a single IP only:

<code class="block"><span class="hl-directive">realip {
	<span class="hl-subdirective">from 1.2.3.4/32
}
</code>

For servers running behind Cloudflare (blocks obtained from their [docs](https://www.cloudflare.com/ips/)):
<code class="block"><span class="hl-directive">realip</span> {
    <span class="hl-subdirective">from</span> 103.21.244.0/22
    <span class="hl-subdirective">from</span> 103.22.200.0/22
    <span class="hl-subdirective">from</span> 103.31.4.0/22
    <span class="hl-subdirective">from</span> 104.16.0.0/12
    <span class="hl-subdirective">from</span> 108.162.192.0/18
    <span class="hl-subdirective">from</span> 141.101.64.0/18
    <span class="hl-subdirective">from</span> 162.158.0.0/15
    <span class="hl-subdirective">from</span> 172.64.0.0/13
    <span class="hl-subdirective">from</span> 173.245.48.0/20
    <span class="hl-subdirective">from</span> 188.114.96.0/20
    <span class="hl-subdirective">from</span> 190.93.240.0/20
    <span class="hl-subdirective">from</span> 197.234.240.0/22
    <span class="hl-subdirective">from</span> 198.41.128.0/17
    <span class="hl-subdirective">from</span> 199.27.128.0/21
    <span class="hl-subdirective">from</span> 2400:cb00::/32
    <span class="hl-subdirective">from</span> 2405:8100::/32
    <span class="hl-subdirective">from</span> 2405:b500::/32
    <span class="hl-subdirective">from</span> 2606:4700::/32
    <span class="hl-subdirective">from</span> 2803:f800::/32
    <span class="hl-subdirective">header</span> X-Forwarded-For
}
</code>