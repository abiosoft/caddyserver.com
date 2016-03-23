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
	<span class="hl-subdirective">strict</span>
}
</code>

- **name** is the name of the header containing the actual IP address. Default is `X-Forwarded-For`.
- **cidr** is the address range of expected proxy servers. As a security measure, IP headers are only accepted from known proxy servers. Must be a valid cidr block notation. This may be specified multiple times.
- **strict**, if specified will reject requests from unkown proxy ips with a 403. If not specified, it will simply leave the original ip in place.

### CIDR blocks
CIDR is a standard notation for specifying IP ranges. To allow a single IP, use `/32` after the ip to specify no mask: `123.222.31.4/32`. To allow ALL Ips (and accept an `X-Forwarded-For` header from anybody), use `0.0.0.0/0`. Most cloud services should have their ip ranges published in this format somewhere.

### Examples

Simple usage to read `X-Forwarded-For` from a few known IPs only:

<code class="block"><span class="hl-directive">realip {
	<span class="hl-subdirective">from 1.2.3.4/32</span>
	<span class="hl-subdirective">from 2.3.4.5/32</span>
}
</code>



### Presets

There is a helper supplied if you want to use caddy behind cloudflare. Simply specify `realip cloudflare` in your caddyfile to activate it using a 
built-in ip list.

Additional presets would be welcome by pull request for other cloud providers.