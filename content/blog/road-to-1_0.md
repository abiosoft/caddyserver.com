---
title: Caddy's Road to 1.0
author: Matt Holt
date: 2016-03-24 08:00:00+00:00
type: post
---

Next month, Caddy is a year old. Actually, I started building it 16 months ago, and those first four months of private development were wild, believe me! Caddy has improved a lot in a year. But where is it going?

A software project's first big milestone after MVP (minimum viable product) is typically version 1.0, when, in theory, it locks in various compatibility and stability guarantees. The exact scope of these guarantees varies from project to project, but nonetheless, having a vision of what 1.0 looks like is critical to a project's success.

I've always known what I want Caddy to be like and what I want it to be able to do. What I didn't know until recently was how that would play out or in what order.

Today, I'm revealing the high-level roadmap for Caddy 1.0. This is a feature timeline, not a calendar timeline, because I can't be sure of delivery dates. But I do know approximately what 1.0 will deliver.

1. Internal restructuring
2. API
3. Investigate privilege de-escalation
4. Fix all known bugs
5. Protocol check
6. Compatibility guarantees

I'll explain each one now, but keep in mind that this blog post does not contain any promises: just a vision, a general roadmap. Anything here is subject to change or may be re-ordered. Any major features that are not described here will likely not be a priority for me to implement in the short-term.


## Internal Restructuring

This is what I'm currently focused on. This is a huge reconstructing of the core Caddy configuration loading code. Anything related to parsing the Caddyfile, setting up middleware components, and unpacking the config into memory is free game. Don't worry, the Caddyfile itself is not changing into some monster.

Already under way, this will allow the user to customize HTTPS settings on a per-site basis rather than having a global HTTPS configuration. This will make it possible to use different ACME challenges for different sites, including the DNS challenge. I'm also looking at enabling the TLS-SNI challenge for use after the server has already started. In addition, this will make it possible to customize the key type (RSA bit length or ECC curve).

I'm also trying to make the entire Caddy configuration serializable as JSON. This is a significant challenge, but if it works, it will allow you to configure Caddy with a single JSON document, rather than command line flags + env vars + Caddyfile.

The Caddyfile syntax documentation will be updated with more well-defined terminology and should be easier to pick up on and follow. Each "block" in the Caddyfile will be a "site" and sites will be able to have paths, not just host and port. We'll also allow limited use of wildcard matching. For example, this will be valid:

<code class="block"><span class="hl-vhost">example.com/foo</span> {
	<span class="hl-directive">root</span> <span class="hl-arg">/www/site1</span>
}<br>
<span class="hl-vhost">example.com/bar</span> {
	<span class="hl-directive">root</span> <span class="hl-arg">/www/site2</span>
}<br>
<span class="hl-vhost">*.example.com</span> {
	<span class="hl-directive">tls</span> {
		<span class="hl-subdirective">max_certs</span> 100
	}
}</code>

Finally, this phase should make it possible for add-ons to declare that they can load the Caddyfile. This will make it possible for add-ons to integrate with dynamic configuration stores. They'll also be able to reload the configuration when it changes.


## API

Caddy will get an API. This will make it possible to configure Caddy while it is running with other tools, including graphical user interfaces. The API will be documented so that you can write clients for it.


## Privilege De-escalation

This is something that [we recently discovered is possible with Go programs](https://github.com/mholt/caddy/issues/528), though the method is unconventional. We still have some implementation details to figure out, but we're at least going to investigate this thoroughly and see if we can get it added by 1.0. The hope is that you can start Caddy as the root user, it will parse the Caddyfile just enough to know what ports it needs to bind, start the listeners, then drop privileges by spawning a "nobody" child process that inherits those file descriptors. The child process will then have to execute the Caddyfile except for binding the listeners and we should be good to go.

This does change the semantics of some things. For example, Startup callbacks currently execute before opening the ports. Since we'll want to run as little code as possible while root, we'll have to change the order so that Startup callbacks don't execute until after privileges have been dropped but before the server loop starts calling `Accept()`. This also affects our current logic for automatic HTTPS which opens ports 80 or 443 to obtain certificates at startup, before the listeners are started.

Then we need to decide if we want the parent process to stay alive and keep the same PID, or if we want to just have one caddy process running like we do now. Feel free to [join the discussion](https://github.com/mholt/caddy/issues/528) if you have thoughts on this!

As you can see, this feature touches quite a few aspects of Caddy and will not be trivial to implement. In the meantime, you can use `setcap` to run Caddy without root privileges.


## Fix All Known Bugs

This one should be obvious, but we do intend to fix all known bugs before the final release of 1.0. We invite anyone in the community to come together to [chat on gitter](https://gitter.im/mholt/caddy) and help us confirm bug reports and squash any that you can!


## Protocol Check

One of Caddy's shining features is using modern protocols like HTTP/2, TLS 1.2, and ACME, to deliver the best possible experience and security to you and your site's visitors. If there is a pure Go implementation of a new, relevant protocol or algorithm that is *almost* ready to use, we want to get our hands on it. It depends how influential the new library would be as to how we integrate it into the timeline (whether we wait on version 1.0 or we release with verison 1.1, for instance). Examples of things I'm keeping my eye on are [Brotli](https://github.com/mholt/caddy/issues/525), [QUIC](https://github.com/mholt/caddy/issues/47), [TLS 1.3](https://twitter.com/grittygrease/status/705929028142673924), and the still-in-flux [ACME specification](https://github.com/ietf-wg-acme/acme).


## Compatibility Guarantees

Finally, looking at what Caddy offers just before 1.0, we'll draft up a compatibility promise to define exactly what "non-breaking changes" are.


## How can we help you get involved?

If you aren't participating in Caddy's development, I invite you to give it a try! Caddy's only awesome because of your help and involvement. We have [a lot to do](https://github.com/mholt/caddy/issues) and I can't do it all by myself&mdash;I've marked a lot of issues as *help wanted*, just for you.

You can do simple things like comment on issues, or solve challenges by fixing bugs and closing issues. Submit pull requests. Review pull requests. If you aren't sure where to start, join us in [Gitter chat](https://gitter.im/mholt/caddy) and let's talk about it! We have a great community that's willing to help and talk about things.

Caddy is a fun web application to work on, and even if you're new to Go, there are ways to help.

If you have any questions, feel free to reach out to me [personally](https://matt.chat) or in GitHub [issues](https://github.com/mholt/caddy/issues) or [Gitter chat](https://gitter.im/mholt/caddy).
