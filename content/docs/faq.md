---
title: FAQ
type: docs
---

### What is Caddy?

Caddy is a web server like Apache, nginx, or lighttpd, but with different goals, features, and advantages.

The purpose of Caddy is to streamline an authentic web development, deployment, and hosting workflow so that anyone can host their own web sites without requiring special technical knowledge.

Caddy is also the first and only web server to serve all live sites over [HTTPS by default](/docs/automatic-https).

### How is Caddy different from Apache, nginx, and lighttpd?

Fundamentally, Caddy aims to make websites easier by lowering the barrier to entry. Like other web servers, Caddy is for system administrators and web developers, but Caddy is also tailored to designers and writers who don't want to deal with a lot of the technical cruft that traditionally comes along with setting up a server.

Caddy has different goals and advantages. Nginx is first and foremost a capable reverse proxy, whereas Caddy's primary goal is to be an easy-to-use static file web server. Caddy desires cross-platform independence and portability without the need for custom builds. And Caddy [defaults to HTTPS](/docs/automatic-https) which is pretty cool.

### Do I have to run Caddy as root to serve on port 80 or 443?

No. On Linux, you can use setcap to give Caddy permission to bind to low ports. Something like `setcap cap_net_bind_service=+ep ./caddy` should work. Consult the man pages of your OS to be certain. You could also use iptables to forward to higher ports.

Privilege de-escalation is another option, but [it is not yet a reliable solution](https://github.com/golang/go/issues/1435). It will be implemented as soon as this becomes a robust possibility. Concerned readers are encouraged to get involved to help this become a reality.

### Does Caddy really serve my site over HTTPS by default?

Yes. You can [read more about automatic HTTPS](/docs/automatic-https) and try it for yourself if you don't believe it.

### How does Caddy keep connections more secure than other web servers?

Caddy is the only web server of its kind to use HTTPS by default and to rotate TLS session ticket keys automatically. All connections to your sites are private and the key rotation helps preserve perfect forward secrecy.

### What's on the roadmap for Caddy?

Exciting things. Here's what's coming:

*   API for remote management
*   Web-based control panel

These aren't in any particular order and are subject to change, but Caddy is well on its way to making these things happen.

### You say Caddy is for a less-technical audience, but... it's still technical.

A graphical UI will soon be available. Caddy's roadmap takes it to an audience that does not need to know how to use the command line. Right now, Caddy is already a great fit for bloggers who set up their own WordPress sites, graphic artists who host their own stuff, developers, etc.

### What's the deal with HTTP/2?

HTTP/2 is a new version of HTTP that makes your website load faster. HTTP/2 is enabled by default when the connection is served over HTTPS. Plaintext HTTP/2 is not supported. You can disable HTTP/2 by using the flag `-http2=false` (this flag will be removed in the future). HTTP/2 will never be served to a client that can only support HTTP/1.

### Who makes and maintains Caddy?

Caddy was written by [Matt Holt](http://matt.life) ([@mholt6](https://twitter.com/mholt6)), who maintains it. The community is also encouraged to contribute. The FastCGI middleware initially received significant contributions from [Thomas Hansen](http://thomashansen.me). The rest of the contributors can be seen on the [Contributors](https://github.com/mholt/caddy/graphs/contributors) page on GitHub.

### How does Caddy perform compared to nginx or Apache?

It's fast. If your site only serves tens of thousands of requests per second on good hardware, then don't worry about it. In our tests—which have been confirmed by multiple trial runs on different hardware, verified independently by different developers—we've found that Caddy and nginx generally perform similarly for most static file needs, a notch above Apache. But this depends on many factors including system environment, hardware capabilities, network, software tuning, etc. We've also seen some tests where Apache performs better than nginx. Given the high degree of variance among these factors combined with your own needs and configurations, we'd rather you discover Caddy's performance for yourself. If you require extremely high throughput and you know what you're doing, do your own benchmarks. If you verify that Caddy is a bottleneck, we welcome your pull request to make it faster.

### Can Caddy be used to serve PHP sites?

Yep, Caddy has a [fastcgi](/docs/fastcgi) directive that makes it really easy to serve PHP sites.
