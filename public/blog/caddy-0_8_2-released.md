---
title: Caddy 0.8.2 Released with On-Demand TLS
author: Matt Holt
date: 2016-02-25 08:00:00
---


I'm excited to announce Caddy 0.8.2, which improves on Caddy's HTTPS/TLS functionality. Along with new features and numerous bug fixes, Caddy is now built on [Go 1.6](https://blog.golang.org/go1.6). See the [full change list](https://github.com/mholt/caddy/releases/tag/v0.8.2).


## On-Demand TLS

With Caddy 0.8, we did something that no other server does: we turned on HTTPS automatically for all your sites by obtaining certificates when the server started. Now with 0.8.2, **Caddy can obtain certificates on demand during TLS handshakes.** It is the first time a web server is capable of getting trusted certificates at request-time, and is an important step in removing the barriers of deploying HTTPS at scale.

To enable this feature, specify *max_certs* in the `tls` directive:

<code class="block"><span class="hl-directive">tls</span> {
	<span class="hl-subdirective">max_certs</span> 50
}</code>

This value sets the maximum number of new certificates that Caddy is allowed to issue during TLS handshakes. Currently, the value applies globally (if specified more than once, the lowest value is used), but this may change in the future. Be as conservative with this value as you can.

A hard limit is required due to the potential for abuse. On-Demand TLS is also tightly rate limited: after the first 10 successful certificate issuances, Caddy will not issue new certificates within 10 minutes of the last successful challenge. And if a challenge fails, Caddy will not try for that name again for 5 minutes. The limiting is reset when Caddy exits.

This feature is superior to using wildcard certificates in the sense that you can't obtain a wildcard certificate for a TLD, i.e. `*.com`&mdash;that'd be a disaster. Instead, you can point any domains you have at your server, and Caddy will serve them over HTTPS; no other setup, installation, or maintenance required.

[I demoed a prototype of this](https://www.youtube.com/watch?v=ZyVA9tuif4s&feature=youtu.be&t=41m26s) at the Provo Linux User Group a little while ago. At the beginning, I asked them to point a throw-away name to my IP address, where I had a prototype of Caddy running with on-demand TLS. Later, they all loaded their domains, which were immediately served over HTTPS. (We later found that those who had trouble tried to do something clever with their hosts file, which doesn't work.)

<b>Keep in mind that Let's Encrypt does not guarantee instant service.</b> In the future, their system might take up to 15 minutes to issue a certificate, rendering this feature unusable. If this becomes a reality, we'll have to reconsider automatic HTTPS&mdash;not only on-demand, but also at startup&mdash;since nobody will want to wait 15 minutes for their server to start up.

When Caddy obtains a certificate on demand, it stores it to disk and caches it in memory for quick retrieval thereafter. Certificates previously obtained for you will be loaded from disk as needed, and you can always specify your own certificates and keys as usual.

You can try this full Caddyfile as an experiment, being careful to specify the `-ca` flag to use Let's Encrypt's staging endpoint (`-ca="https://acme-staging.api.letsencrypt.org/directory"`). We assume you have a starting certificate that you want to use, as well as a backend app that serves new host names dynamically:

<code class="block"><span class="hl-vhost">:443</span>
<span class="hl-directive">tls</span> <span class="hl-arg">default.crt default.key</span> {
	<span class="hl-subdirective">max_certs</span> 5
}
<span class="hl-directive">proxy</span> <span class="hl-arg">/ localhost:5001</span>
</code>

With a simple configuration like this, your app can serve all your different host names on-the-fly, even if they are not subdomains or even under the same TLD. Be aware this config serves *all* hostnames pointed at your machine. A future version of Caddy will allow you to narrowly scope the domains served without having to enumerate each one.

Remember that any rate limits enforced by the CA still apply.



## Load Multiple Certificates in Bulk

Caddy now has the ability to load certificates and keys from a directory, rather than individual files:

<code class="block"><span class="hl-directive">tls</span> {
	<span class="hl-subdirective">load</span> ../certificates
}</code>

Similar to [how HAProxy does it](http://cbonte.github.io/haproxy-dconv/configuration-1.7.html#5.1-crt), Caddy will walk that directory, looking for .pem files. Each file should contain the certificate chain and associated key bundled in PEM format. This is an easy way to load many certificates at once. You can use this in conjunction with On-Demand TLS if you're already maintaining some of your own certificates you want to use.


## No More Automatic Restarts

Caddy no longer restarts on its own. Previously, it would restart to renew certificates and refresh OCSP staples, giving Caddy a new process ID each time. This is no longer necessary, which means there's less room for things to go wrong. Graceful reloads by signaling USR1 still restart the process, but these are user-initiated.


## Proxy Improvements

You can now proxy to backends that use self-signed (or otherwise untrusted) certificates by setting `insecure_skip_verify`. However, be aware this defeats the purpose of HTTPS as the connection may not actually be secure.

Added too is the ability to proxy to Unix sockets, by specifying `unix:`, followed by the socket path, for example: `unix:/var/run/www.socket`.


## On Deck: ACME Upgrades

ACME is the protocol that underlies Caddy's automated HTTPS features. Let's Encrypt, Caddy's default ACME CA, recently added support for the DNS challenge as specified by the ACME spec working draft. Caddy does not yet utilize the DNS challenge, but that's slated for the next release if all goes well. The primary advantage of the DNS challenge is that the CA's servers do not need to contact your server; they only need to check a DNS record. The disadvantage, of course, is that you need to provide DNS credentials so Caddy can set and remove a TXT record on your domain. We'll figure out these details before too long.

Let's Encrypt also recently added the ability to issue elliptic curve certificates. We'll look at making this available in the next release as well.



## Thanks to Contributors

Props to Filippo Valsorda, Xidorn Quan, alehano, Benoit Benedetti, Kevin Bowrin, Den Quixote, DenBeke, Abiola Ibrahim, David Darrell, Miek Gieben, Craig Peterson, Jason Chu, Vadim Petrov, Raphael Pohl, elcore, Nathan Probst, and Jacob Hands for their contributions which make this release possible!

Seriously, I don't have the time to do this all myself so your help is invaluable. We invite all who are able to contribute! There are [plenty of open issues](https://github.com/mholt/caddy/issues) to tackle.

And a huge thanks to our primary sponsor right now, [Arroyo Networks](https://www.arroyonetworks.com), for making it possible for me to devote some time each week to work on Caddy.

If your company uses Caddy, consider funding the project with regular donations. We also have sponsorship opportunities available. Please contact me if you're interested!

