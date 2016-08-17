---
title: Caddy 0.9.1 Released
author: Matt Holt
date: 2016-08-17 16:00:00+00:00
type: post
---

Caddy 0.9.1 is a patch release full of bug fixes, enhancements, and minor new features. If you experienced problems with proxying, WebSockets, or&mdash;in some cases&mdash;deadlocks in Caddy 0.9, chances are good your issues have been resolved. More plugins are now 0.9-compatible and a new rate limiting plugin is available. Several improvements were made to Caddy's TLS/ACME features, and we now build with [Go 1.7](https://blog.golang.org/go1.7).

[Download Caddy 0.9.1](/download) or [see full change log](https://github.com/mholt/caddy/releases/tag/v0.9.1).

Let's take a quick look at the highlights, but first I want to thank the the dozens of contributors who came together to make this release happen!


## Thank You

A big thank you to all who contributed code for this release: Simon Lightfoot, Volodymyr Galkin, definitelycarter, Abiola Ibrahim, elcore, Stavros Korokithakis, Nimi Wariboko Jr., Tw, Eric Drechsel, Wolfgang Johannes Kohnen, Leo Koppelkamm, Philipp Brüll, Viacheslav Chimishuk, and Garrett Squire.

I should recognize all the others who helped with the debugging process in issues and the forum. Caddy users everywhere appreciate your participation and patience. Thank you!


## Bug Fixes

0.9 introduced some bugs in how the proxy middleware handles headers, which caused a handful of applications that rely on the `transparent` or `websocket` presets to break. Header logic has been corrected, which reportedly fixes the issues experienced by users.

Additionally, some specific WebSocket applications were intolerant of the way Caddy negotiated protocol upgrades because Caddy created a new connection upstream for WebSockets. This wasn't a problem for most WebSocket services, but now, Caddy will use the existing, underlying connection for WebSockets instead of dialing a new one.

There was a regression that set the default TLS version to 1.0 instead of 1.1. We've added another test to ensure the minimum version is always set properly.

One other regression related to TLS was patched, being that the ACME challenges again honor the `bind` directive, so you can be sure to obtain certificates when you need to bind the listener to a specific hostname.

Boulder (Let's Encrypt's ACME server software) was recently updated with a clever optimization that our underlying ACME package did not fully expect. In some cases, this caused the ACME challenges to hang indefinitely. This is now fixed.

Bugs are a natural and expected part of every software project. I do apologize for the pain points in 0.9; we have unit tests that catch and prevent many of the bugs that would have shipped, but I admit we need more. We will also be working on adding robust integration and systems tests in the future.


## Proxy Keep-Alive

Busy proxy servers may have experienced exhaustion of dynamic TCP ports. With Caddy 0.9.1, you can now configure a maximum number of connections to keep alive to the upstream hosts. By increasing the size of the connection pool, your proxy will perform better under load on a properly-tuned system.

Currently, Go's default "MaxIdleConnsPerHost" value is 2. Caddy will continue to use this default for now, but you can specify `keepalive` followed by a number inside the proxy directive to change that value. For example, `keepalive 0` will disable keep-alive entirely, and `keepalive 100` will allow Caddy to reuse 100 concurrent connections. The ideal number for your situation will vary.


## IP Hash Load Balancing

You can now proxy to multiple upstreams according a new load balancing policy called _ip\_hash_. This policy hashes the remote client's IP address and uses that to select an upstream. This means that a client will always contact the same upstream host.

To use it, set `policy ip_hash` in the proxy directive of your Caddyfile.


## Persisting OCSP Staples

Caddy already staples OCSP responses for all qualifying certificates by default. However, in preparation for [OCSP Must-Staple](https://www.grc.com/revocation/ocsp-must-staple.htm), Caddy now persists OCSP responses to disk. These files are fully maintained and no action is required by you.

Once Must-Staple is enforced, certificates will need a valid OCSP response attached to them in order to be accepted by well-mannered clients. Since OCSP responses expire and must come from an authoritative third-party, it is critical that the OCSP client (your web server) implement certain failover mechanisms. With Must-Staple, OCSP will become a matter of uptime, not merely extra security.

We have more work to do before Caddy is fully ready for Must-Staple, but we're getting there.


## Other Improvements

You can log request bodies for JSON or XML content types with the `{request_body}` placeholder. It compacts the body to one line and limits the size to 100 KB. There may be performance implications of logging the body like this, so very busy servers should probably avoid this.

Define a default, catch-all error page like so:

```
errors {
    * default_error.html
}
```

Until now, Caddy would consume all ACME challenge requests, even for names it did not serve. This meant if you ran an ACME client on the same machine as Caddy, you could never even proxy the challenge request to the other client. Well, now you can. Note that this applies to the HTTP challenge only.

The `max_certs` limit in the `tls` directive is no longer a process-wide global maximum; it applies only to the site in which it is defined.

If you want to be a part of this project, join our [forums](https://forum.caddyserver.com), check out our [issues](https://github.com/mholt/caddy/issues), read the [wiki](https://github.com/mholt/caddy/wiki) - there are a lot of ways to help out. Thanks for using Caddy, we hope you like this new release!
