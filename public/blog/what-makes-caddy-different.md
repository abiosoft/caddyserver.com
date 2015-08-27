---
title: What Makes Caddy Different
author: Matt Holt
date: 2015-08-27 08:00:00
---

In many ways, Caddy is not unique. When httpd was released as open source software decades ago, it immediately took the OSS community by a storm and everyone was putting up their own web sites. Httpd changed the scale of the web by orders of magnitude as it was adopted by thousands, then millions of users. It hasn't changed too much since.

Meanwhile, several other web servers have gained traction: nginx, IIS, and lighttpd for instance. The current relevancy of each one can be argued variously, but the truth is each have advantages and disadvantages. Even though they do the same basic thing, they do so in different ways and are surrounded by different communities, ecosystems (including none at all), and feature sets.

Knowing this space is competitive, Caddy was designed not as just another web server. Yes, at its core, it serves the Web. But the vision of the Caddy project goes beyond just serving files easily and efficiently. Caddy exists to make the whole experience better for the people who create the Web. We'll take a look at a few of these things that set Caddy apart.


## Truly cross-platform

If you love IIS, I hope you run your site on Windows. Caddy is available for every platform and works (nearly) the same on every architecture and operating system. That means you can move your site from Windows to Linux without worrying about compatibility. 

Granted, this is a virtue of Go (the language in which Caddy is written) more than the Caddy project itself. However, cross-compiling Go programs is not a free lunch, so we've taken special care to ensure that Caddy can be cross-compiled to any other platform without trouble. This means we avoid writing code or using libraries that would cause critical Caddy features to fail on a different system. For example, we avoid using C libraries that aren't always available on Windows systems.

The good news for you is that you can run Caddy on Windows, Mac, Linux, BSD, Solaris, and even Android (soon iOS) and it will work the exact same way.


## Self-contained and no compilation necessary

I recall a time I had to compile a very popular web server from source with an extra module to simply add some non-standard headers to the response. That compilation on an EC2 instance took over an hour! It worked, but it dumped a bunch of dev dependencies onto my small, disposable cloud instance. Try to repeat the procedure with a slightly different set of dependencies and it may not work.

Caddy is a single, statically linked executable&mdash;again, a virtue of being a Go program&mdash;that has no external dependencies. That binary includes the Go runtime which performs garbage collection and smarter coroutine scheduling than what the operating system can do. Although this means the binary is larger than that of lighttpd, for instance, you get better performance and you won't lose any nuts and bolts.


## Written for people

"Caddy was written for humans, with the Web in mind." This means that usability and experience take the driver's seat to new features and enhancements. If a feature or change is not easy to use, intuitive, or consistent with the rest of the program, it is redesigned or discarded. We want people to set up their web site, then sit back for a moment, and say, "Huh! I actually enjoyed that."

And so far, we're doing pretty well with that vision. Although we may sacrifice the occasional power-user feature, Caddy is still a competent server and, as a result, is much easier to use. For example, Caddy avoids supporting regular expressions because, although powerful*, regular expressions have been known to be tricky.

_* Technically, regular expressions are only as powerful as finite state automata which are some of the weakest computing models in theory; they can only match regular languages. Most regexp that you're used to, like those "Perl-compatble regular expressions" (PCRE) are essentially implemented as Turing machines, which are the most powerful computing model known to man. Also the most complicated._


## "I wish my server did that."

Caddy's genesis is one of fulfillment. It was originally created to satisfy the wishful thinking, "I wish my web server could do this thing," or, "I wish my web server worked like this instead." As such, Caddy makes it easy to do common tasks that require non-obvious methods in other web servers if they're even possible at all, like serving clean URLs without file extensions, integrating with PHP, or [deploying your site with git push](https://caddyserver.com/docs/git).

As such, Caddy is [extensible](https://github.com/mholt/caddy/wiki/Extending-Caddy), both for your own private use and on the [Download page](https://caddyserver.com/download) of the Caddy website. Extending Caddy allows you to deploy your web app in conjunction with static assets. Caddy add-ons can execute background processes or hook into the middleware chain and access requests&mdash;or both.

Caddy is a solid static file server and you can build upon it in nearly limitless ways. If your customization is beneficial to Caddy users in general, [add it to the Download page](https://github.com/caddyserver/buildsrv/blob/master/CONTRIBUTING.md) so others can use it!


## An emphasis on what matters most

Community, usability, performance, and security. Indeed, these are the values that Caddy esteems as most important. Without a great community, everything else will collapse as maintenance would decline. A web server that is hard to use or ill-performing will never be adopted. And these days, security is paramount (the current state of affairs is rather sad&mdash;no pun intended on [the latest major breach](https://en.wikipedia.org/wiki/Ashley_Madison_data_breach)).

[Caddy's community](https://gophers.slack.com/messages/caddy/) is active and inviting for both contributors and users (and lurkers) alike. Please feel free to join us.

Caddy is already the easiest web server to use&mdash;because I said so. You have my word.

Performance is up there with nginx, definitely surpassing Apache's httpd in some quick, unscientific benchmark tests. Caddy also supports HTTP/2 out-of-the-box, which is more than any other mainstream server can say currently.

We're always vigilant to keep Caddy secure and promote secure practices and protocols. For example, Let's Encrypt integration is coming soon, which will allow site owners to serve their site over HTTPS without needing to buy a certificate (Caddy will use Let's Encrypt to generate one for you automatically). We're very excited about this.

We hope you're excited about Caddy too, and if you haven't yet, do try it. It's great for local and production use.
