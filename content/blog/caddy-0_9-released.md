---
title: Caddy 0.9 Released with All New Core
author: Matt Holt
date: 2016-07-18 22:00:00+00:00
type: post
---

Wow, where to begin. Caddy 0.9 is the biggest update yet. We completely overhauled the core design and TLS features, renovated addons into a new plugin model, added experimental QUIC support, fixed bugs, upgraded the Caddyfile, and made a significant number of other improvements and changes. I'll try to cover them all in this post and talk about what's coming next and in the future. Sorry (not sorry) for the long post!

For those finding Caddy for the first time: Caddy is an easy-to-use HTTP/2 web server that uses HTTPS&mdash;not HTTP&mdash;by default. With this release, we're bringing that TLS magic to more than just HTTP. We're also the first to usher in QUIC support.

We consider this release stable, but as always, stay tuned for patch releases in the future and be sure to stay up-to-date. [Download Caddy 0.9 now.](/download)

See the [full change log](https://github.com/mholt/caddy/releases/tag/v0.9.0) and download this new release. Although _most_ of the middleware haven't changed much, there are a few breaking changes to be aware of, which we'll talk about below.

## New Core

Your feedback and contributions have expanded my vision for Caddy more than I ever expected. To continue delivering value to you relative to Caddy's mission, I spent significant time redesigning Caddy and rebuilding it from the ground-up.

Here's what version 0.9 looked like when I started working on it:

```
package main

func main() {
}
```

Code from the old version was brought over as needed: sometimes just a function, other times a whole file, and then carefully refactored. Dependencies were inverted to accommodate a new plugin model, whereby the Caddy core became clearly defined.

The new Caddy core is agnostic to the idea of HTTP, TLS, middleware, and even to how the Caddyfile is loaded. At its core, Caddy is a Go package which:

- Loads a configuration file (using some loader plugin)
- Executes the directives in that file
- Starts servers while collecting their listeners
- Provides a path in which to store assets
- Facilitates a few miscellaneous operations common among servers
- Handles signals, logging, graceful restarts, etc.

Every other functionality&mdash;HTTP, TLS, middleware, loading the Caddyfile&mdash;comes from plugins.



## Plugin Architecture

Plugins are Go packages or types that register themselves with Caddy or with another Caddy plugin in its `init()` function. Plugins are plugged in simply by importing them in Caddy's main: `import _ "path/to/plugin/package"`.

Plugins replace traditional add-ons and can now do more than merely add directives to the Caddyfile. Plugins can:

- Change how the Caddyfile is loaded
- Implement an entire server type (HTTP, DNS, etc.)
- Add a directive to the Caddyfile
- Inject middleware
- Run background code
- Plug into other plugins that support it (like adding a DNS provider to the `tls` directive)

And with the new core, it will be easier to turn other functionality into plugins in the future.

Instructions for writing and publishing plugins are available [on the project wiki](https://github.com/mholt/caddy/wiki/Extending-Caddy).

On a less significant note, we renamed the `-directives` flag to `-plugins`.


## Alternate Server Types

The HTTP server is a Caddy plugin, which means that Caddy is capable of serving other things too. While HTTP is the default type of server, imagine using Caddy to serve DNS, mail, SSH, git, and other server types with all the benefits of Caddy: easy install and configuration (Caddyfile), portability, good documentation, and most importantly, fully managed TLS.

Caddy's TLS and HTTPS code were surgically separated so that Caddy's powerful TLS features can be used by any server type that benefits from TLS, not only HTTP. Imagine a mail server that uses STARTTLS without needing to fuss with certificates. Or an FTP server that's always (and only) secure. Or a git server that always supports HTTPS by default. **The goal here is to make it easier than ever to serve secure connections, no matter what you're serving.**

When implemented, other server types can be made available on Caddy's download page. Then using Caddy with an alternate server type is as easy as writing its Caddyfile and running `caddy -type dns` for example.

Although I won't be implementing other server types myself so I can stay focused on HTTP, I strongly encourage other Go developers to do so! It's a great way to level up your open source game; your work will be made available to thousands of users. We have [instructions on the wiki](https://github.com/mholt/caddy/wiki/Writing-a-Plugin:-Server-Type) to get started.

### CoreDNS: The Caddy DNS Server

[Miek Gieben](https://miek.nl/) has already implemented [a DNS server using Caddy](https://github.com/miekg/coredns). This DNS server can run middleware and is configured with the Caddyfile. Originally a fork of the entire Caddy project, it will soon be made available on Caddy's download page as a plugin. By converting his fork to a Caddy plugin, Miek was able to delete thousands of lines of duplicated code. Huge thanks to him for his help ensuring Caddy can handle various server types.


## ACME DNS Challenge

Caddy 0.9 adds support for the DNS challenge, meaning Caddy now fully supports all three ACME challenge types. The DNS challenge will allow you to obtain a certificate when HTTP or TLS-SNI challenges would fail; for example, if you're behind a load balancer, have a strict firewall, or ports 80 or 443 are already in use.

If you find yourself in these trickier infrastructure scenarios, use the DNS challenge. The DNS challenge sets a TXT record in your zone file so it does not require you to open a listening port. But you do have to give some sort of API credentials for your DNS provider. Caddy currently supports 10 DNS providers with more easily added. Read more about [using the DNS challenge](/docs/automatic-https#dns-challenge) and about [adding new DNS providers to Caddy](https://github.com/mholt/caddy/wiki/Writing-a-Plugin:-DNS-Provider).


## Experimental QUIC Support

Thanks to fine work by [Lucas Clemente](https://github.com/lucas-clemente/quic-go), Caddy is the first web server to ship with experimental QUIC support! QUIC is a new protocol being developed by Google to replace the TCP/TLS stack. With QUIC, TLS handshakes require only one round trip. It avoids TCP slow start and head-of-line blocking, making your HTTP/2 site load even faster. It will also load reliably when switching networks.

![QUIC screenshot](https://cloud.githubusercontent.com/assets/1128849/15681999/cc324814-2718-11e6-93b9-42b28ee434d6.png)

Currently only Chrome supports QUIC, and at time of writing, you have to turn it on. [See the wiki for instructions on using QUIC](https://github.com/mholt/caddy/wiki/QUIC), and be advised we don't recommend enabling it on really important sites quite yet. But please give it a try!

Enable QUIC for your HTTPS sites with the `-quic` flag.


## Improved Restarts

Using SIGUSR1 to restart Caddy no longer requires spawning a new process. This means that graceful restarts happen entirely in-process with the same process ID. As such, we removed the short-lived `-restart` option.


## Paths and Wildcards in Site Addresses

Site addresses in the Caddyfile can now have paths:

<code class="block"><span class="hl-vhost">example.com/foo</span> {
	...
}<br>
<span class="hl-vhost">example.com/foo/bar</span> {
	...
}</code>

In the case of overlap, the site with the longest matching path will be preferred. There is no inheritance between sites; every site is distinct even if they share a hostname.

Speaking of hostnames, they may now make use of wildcards:

<code class="block"><span class="hl-vhost">\*.example.com</span> {
	...
}<br>
<span class="hl-vhost">\*.foo.example.com</span> {
	...
}</code>

Wildcards must replace an entire domain label (i.e. `*mple.com` is not valid) and must start from the left (i.e. `example.*` is not valid). This requirement mirrors those for TLS certificates in case an ACME CA one day supports the issuance of wildcard certificates.

In the case of overlap, the most specific matching hostname will be chosen. And of course, wildcards and paths can be combined.


## Easy Self-signed Certificates

Ever wanted to develop a site locally with HTTPS just for testing? Instead of generating your own self-signed certificates, Caddy can do it for you easily:

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg">self_signed</span></code>

This enables HTTPS for the site using a self-signed certificate that is kept only in memory. You will have to bypass certificate warnings in your browser, of course, but you can also set a Chrome flag to ignore certificate warnings for localhost.



## Moved TLS Assets

The `.caddy` folder is where Caddy stores its TLS assets and, in the future, perhaps other things. By default, it is in `$HOME/.caddy`, but you can set the `$CADDYPATH` environment variable now to change the full path of the `.caddy` folder.

Within `.caddy`, we've renamed the `letsencrypt` subfolder to `acme` since Caddy technically works with any ACME-compliant CA. We restructured the inside of that folder slightly, grouping sites and accounts by CA hostname. This is because accounts are not transferrable to other CAs (for example, when switching between staging and production endpoints).

Don't worry, though: Caddy quietly makes this migration for you; you should not notice that it happened or have to do anything! And switching CAs using the `-ca` flag will work much better.


## Proxy Directive Improvements

Before 0.9, proxy rules were chosen in the order they appeared in the Caddyfile. If two paths overlapped (consider `/a` and `/a/b`), it would always choose the one listed first in the file, even though the second one might be more specific; consequently the second one never was chosen. This has been changed so the order no longer matters; the rule with the specific matching path will be applied.

Many upstreams can be specified at once using port ranges. For example, `proxy / localhost:8080-8090` specifies ten upstreams at localhost on the ports 8080 through 8090. There's also a new `upstream` subdirective to make it easier to list multiple upstreams on different lines.

You have more control of headers. Until now, you could only set headers going up to the backend. But now you can set, add, or remove headers going either upstream or downstream. Use the `+` or `-` to add or remove, respectively. For example, `header_upstream -Server` will remove the `Server` header going up to the backend; `header_downstream +Server MyProxy` will add another `Server` header on its way back down to the client.

We also added a new `transparent` preset if you want requests to the backend to have the original hostname, rather than the hostname of the backend. It also sets a few other headers; [check the docs](/docs/proxy) for details.

## Redirect Conditions

The [`redir` directive supports `if` statements](/docs/redir) for simple condition checking before applying the redirect rule. We wanted to avoid this complexity but apparently many legacy web applications still require the web server to do their programming for them. Redir and rewrite both have this same functionality now, including an `if_op` keyword to change the way multiple ifs are combined (default is AND but `if_op or` will use OR.)


## Breaking Changes to Proxy, Markdown, Import, and TLS

The `proxy` directive no longer uses `proxy_header` which is deprecated and will be removed in a near-future version. Instead, you can now control upstream and downstream headers with `header_upstream` and `header_downstream`. 

The `markdown` middleware no longer supports static site generation. We did this out of concern for scope creep, and I recommend using [Hugo](https://gohugo.io) for your static site needs. In fact, Henrique Dias helped move the Caddy website to Hugo. Thank you!

The paths used with the `import` directive are now relative to the file, not the current working directory. Now it doesn't matter from which directory you run Caddy.

The `tls` directive no longer supports `ssl3.0`. The minimum protocol version is now `tls1.0`, but the default minimum is `tls1.1`.


## Breaking Changes to the Package Structure

Those of you who use Caddy as a library in your own Go programs or who are performing custom builds using your own build scripts should be aware of some changes. The Caddy core package is now `github.com/mholt/caddy`. This is the one you want to import if you use Caddy programmatically.

Caddy's `main()` is now at `github.com/mholt/caddy/caddy` and the logic for `main()` is in a function called `Run()` at `github.com/mholt/caddy/caddy/caddymain`. These changes allow more flexibility when extending or customizing Caddy for your own use.

If you are a plugin author you should already be aware of the changes needed for 0.9 compatibility; they are described on [a temporary page in the Caddy wiki](https://github.com/mholt/caddy/wiki/Converting-Add-ons-to-Plugins). I've tried to make pull requests to your add-ons if they had not migrated to the new format.

Caddy loses much of its global state in 0.9, so when you call `caddy.Start()` you now get an `Instance` back, which you can `Restart()`, `Stop()` or `Wait()` on. This allows you to run multiple server types at the same time in the same process.

See the [godoc](https://godoc.org/github.com/mholt/caddy) and the code as the ultimate authority on these matters.


## Next Steps and Future

Lots of upgrades are due for Caddy's supporting infrastructure. The website will be redesigned with better navigation and documentation. We will be sure the site is capable of documenting the various server types that may be implemented for Caddy in the future.

The build server, along with the developer tools caddyext and caddydev will be rewritten. We have plans for a build server that automates testing and deployment of updates to Caddy and its plugins when authors push new changes for release. We also hope, in the future, that historical, reproducible builds will be possible given a list of dependencies and the commit or tag at which to build them.

The developer tools will be phased out and replaced with a new tool for Caddy users to manage their own Caddy installation with regards to plugins. It will include that portion of the build server responsible for swapping out plugins and building the customized program.

We will probably not have a tool to automate the development of new plugins given the new, modular architecture of Caddy and the fact that such changes are typically only one or two lines.

As for features, we will shortly begin work on a REST API and web UI with which to manage your Caddy instance(s). The technical details of this are still being determined, but it's definite that the API and the web UI will be extensible with plugins. We also hope that, as these features mature, Caddy will be entirely operable without the command line, enabling less technical users to set up their own websites.


## Get Involved

Want to get involved with an awesome project? We have a place for you! The most helpful thing newcomers to our project can do is help [fix bugs](https://github.com/mholt/caddy/issues) by writing tests and submitting pull requests. Or, perhaps [find another open issue](https://github.com/mholt/caddy/issues) and add to the discussion. Join our [forum](https://forum.caddyserver.com) and answer questions that others have.

You may also [implement new server types or plugins for Caddy](https://github.com/mholt/caddy/wiki/Extending-Caddy) to add new functionality. We'd love to see what you come up with! Together we can get _all the Internet things_ secured and usable.


## Thank You

As always, a huge thanks are in order to [all the contributors](https://github.com/mholt/caddy/commits/master) and donors who made this release possible. Your work does not go unnoticed, and it is highly appreciated! Thank you for making Caddy possible.
