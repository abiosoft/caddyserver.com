---
title: Caddy 0.8.3 Released
author: Matt Holt
date: 2016-04-26 08:00:00+00:00
type: post
---

Today we're releasing Caddy 0.8.3 which features TLS session ticket key rotation, a few other small new features, and many bug fixes and other internal improvements. As usual, I highly recommend upgrading after conducting reasonable tests with your site and environment.

It's been two whole months since the last release because significant efforts have been concurrently invested in version 0.9, which will be released in the coming months (probably after some 0.8.4 release).

Caddy 0.8.3 is built with Go 1.6.2.


## Credit to the collaborators

The project is becoming a little more autonomous. Between 0.8.2 and 0.8.3, the number of collaborators&mdash;users granted commit rights to the repository&mdash;has more than doubled. This has allowed me to spend more time on 0.9 work and means that this release contains the most changes with the least involvement from me. Thank you to all who made it possible!

The list of contributors is longer this time: W. Mark Kubacki, Abiola Ibrahim, Elias Probst, Tobias Weingartner, elcore, William Bezuidenhout, Thomas Boerger, Tw, Wolfgang Johannes Kohnen, Benny Ng, Sean Kilgarriff, Pieter Raubenheimer, Ruben Callewaert, Raphael Pohl, DenBeke, Dave Goodchild, María de Antón, Marcelo Magallon, ERIIX, Shawn Smith, and David Prandzioch. Many thanks!

Now let's talk about what's new and notable in this version.


## TLS session ticket key rotation

Caddy already supported TLS session resumption with ticket keys. But now, Caddy will rotate ticket keys automatically and by default. This helps it maintain perfect forward secrecy for you. As far as we know, Caddy is the first (and so far only) web server to do this out of the box.

Currently, keys are rotated every 10 hours.


## New middleware: pprof and expvar

The new `pprof` and `expvar` directives are useful for debugging and collecting process metrics. Use [pprof](/docs/pprof) to generate a process performance profile. Use [expvar](/docs/expvar) to expose variables related to the runtime (add-ons can expose other variables as well); expvar is especially fun with tools like [expvarmon](https://github.com/divan/expvarmon) for a simple, high-level overview of the server process.


## ETag

Caddy now adds an ETag header when serving static files. This is still experimental, but we believe it to be a good start. This header can be used by your browser to speed up page loads and also invalidate its cache when page content changes.


## Other improvements

We've upgraded the build process, which now embeds version information dynamically into Caddy using a build script, and our build server has been upgraded to accommodate that. In the future, Caddy's build server will be replaced with a newer, more automatic system, allowing add-on authors to safely publish their updates without manual intervention.

Numerous bugs have been reported and fixed in the browse middleware, the core server handler, the proxy middleware, and the certificate renewal code. You can [view the release](https://github.com/mholt/caddy/releases/tag/v0.8.3) for details.


## Five new addons

Since the 0.8.2 release, five new addons have made their debut: [mailout](/docs/mailout), [upload](/docs/upload), [realip](/docs/realip), [prometheus](/docs/prometheus) and [jwt](/docs/jwt).

The `mailout` addon is capable of processing contact forms on your site by sending PGP-encrypted (or plaintext) emails to your inbox when a form is submitted. The `upload` directive is for uploading files to your server, for example build artifacts. The `realip` directive is useful for extracting the user's real IP address if possible. `prometheus` integrates Prometheus monitoring stats for your sites. Finally, the `jwt` directive facilitates JSON Web Token authorization. These are third-party-contributed and maintained. Thanks for making Caddy even more useful!


## Mailing list

Did you know we have a mailing list? We figured you might like to know since our blog doesn't have an RSS feed. :)

You can [sign up here](http://eepurl.com/bShyGL) if you're interested. (Note: Plaintext HTTP link. You should bug [Mailchimp](http://mailchimp.com/contact/) about using HTTPS to protect your privacy! Maybe there's a web server out there that does it automatically and for free! Hmm...)

We hope you like this release. Please consider getting involved or [donating](/donate) if you want to be a part of changing the way we serve the Web!


## Thanks to sponsors

Huge thank you to our sponsor [Arroyo Networks](https://arroyonetworks.com) who makes it possible for me to devote more quality time to the project. Also our new DNS provider is [DNSimple](https://dnsimple.com) who is helping us keep the Caddy website and downloads available at all times!
