---
title: Caddy 0.8 Released with Let's Encrypt Integration
author: Matt Holt
date: 2015-12-04 08:00:00+00:00
type: post
cover: https://caddyserver.com/resources/images/blog/caddy-0_8-announcement-cover.png
---

Today, I'm very excited to announce Caddy 0.8! It features [automatic HTTPS](/docs/automatic-https), zero-downtime restarts, and the ability to [embed Caddy](https://godoc.org/github.com/mholt/caddy/caddy) in your own Go programs. (**[Download](/download)**)

<div style="text-align: center; margin-top: 15px;">
<iframe src="https://ghbtns.com/github-btn.html?user=mholt&repo=caddy&type=star&count=true" frameborder="0" scrolling="0" width="100px" height="30px" style="vertical-align: middle;"></iframe>
<a href="https://twitter.com/caddyserver" class="twitter-follow-button" data-show-count="false" data-dnt="true">Follow @caddyserver</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p='https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script></div>

Today, Internet users are [threatened with mass surveillance](https://www.schneier.com/blog/archives/2015/06/why_we_encrypt.html) and [invasive packet tampering](https://gist.github.com/Jarred-Sumner/90362639f96807b8315b) which undermines our privacy and destroys the integrity of what we read. Encryption can keep the Web safe and [reliable](http://http2-explained.haxx.se/content/en/part5.html#52-http2-for-https) if it's used everywhere, but this will never happen while site owners need extra financial and technical means to employ encryption if they can run their site more easily without it.

**That is why, effective this release, Caddy will automatically serve all live sites over HTTPS without user intervention.** Caddy is the first general-purpose web server to default to HTTPS, fully manage all relevant cryptographic assets for you, and configure itself to redirect HTTP to HTTPS. Check it out, with real footage of a real site in real time:

<div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
	<iframe style="max-width: 640px;" width="100%" height="480" src="https://www.youtube-nocookie.com/embed/nk4EWHvvZtI?rel=0" frameborder="0" allowfullscreen></iframe>
</div>

**It is important for all sites, in their entirety, to use HTTPS.** A site does not need to collect sensitive information to merit encryption. If only sensitive transmissions are encrypted, it instantly flags those transmissions as sensitive. And without HTTPS, it is effectively impossible to tell if content was modified on its way to your computer. Tracking code can be injected. Your network activities can be collected and mined by government and corporate agencies. Both users and site owners are subject to attack.

*Any site owner using Caddy 0.8 can encrypt* without extra effort, money, or technical knowledge. **It works on every platform and has no dependencies.** I and all the contributors who made this  possible hope you enjoy this new, effortless way to use HTTPS.

To be clear about how easy and automatic we're talking about, run Caddy with a simple Caddyfile:

<pre><code class="block"><span class="hl-vhost">yoursite.com</code></pre>

Or just run Caddy like this:

<pre><code class="shell">$ caddy -host yoursite.com</code></pre>

And you will see, after a few seconds, that your site is served with HTTPS. (Of course, Caddy must be able to bind to ports 80 and 443.)


## Let's Encrypt

Caddy's certificate authority of choice is [Let's Encrypt](https://letsencrypt.org). Using the ACME protocol, Caddy is able to generate keys, issue certificates, and renew them for you automatically for free.

To make this possible, Caddy may ask for an email address if one is not already available. This is not required, but is strongly recommended to recover your account in the event you lose your key. Also, you may be asked to agree to the Let's Encrypt Subscriber Agreement. You can bypass both prompts by using the `-email` and `-agree` [command line flags](/docs/cli).

If you already have your own certificates and keys, you can continue to use them by specifying them in the Caddyfile as you have always done before (with the [tls](/docs/tls) directive). For more information, read the page about [automatic HTTPS](/docs/automatic-https).


## Graceful Restarts

In order to support automated certificate renewals, we needed a way to restart the server. Caddy restarts on its own, for example, when a certificate is renewed.

Restarts on POSIX-compliant systems are graceful and incur zero downtime. Caddy will spawn a new process and get a new PID. Restarts on Windows are forceful but very quick and in-process.

Using [signals](/docs/cli#signals), you can trigger Caddy to reload its configuration or shut down. In a near-future version, Caddy will have an API that allows you to do this on any platform locally or remotely.

If you use the `startup` or `shutdown` directives, keep in mind that those commands are only executed when you initially start the server and when the server is shut down. They are not executed during restarts.


## The `caddy` Package

The features continue to cascade. In order to support graceful restarts, we had to completely refactor the Caddy core. This means you can now use Caddy in your own Go programs.

It's easy to use:

<pre><code class="go">import "github.com/mholt/caddy/caddy"

// You can start...
err := caddy.Start(caddyfile)
if err != nil {
    log.Fatal(err)
}

// restart...
err = caddy.Restart(newCaddyfile)
if err != nil {
    log.Fatal(err)
}

// and stop Caddy services.
err = caddy.Stop()
if err != nil {
    log.Fatal(err)
}</code></pre>



## Other Changes

We've made a lot of other improvements and added other features, such as a process log, [mime](/docs/mime) directive, and support for environment variables in the Caddyfile. See [the full change list](https://github.com/mholt/caddy/releases/tag/v0.8.0) on GitHub.


## Feedback So Far

> "magic... worked."

&mdash;[Jiahua Chen](https://twitter.com/joe2010xtmf/status/664163021879681025), author of [Gogs](https://gogs.io)

> "I think this is revolutionary, putting a website automatically on https. This is sooooo easy \o/"

&mdash;Maxime Lasserre, [stargraph.co](https://stargraph.co)

> "we have a winner! You guys friggin RULE. this is huge."

&mdash;[Brian Ketelsen](https://brianketelsen.com/caddy-hugo-letsencrypt/), Gopher Academy

Luit van Drongelen also wrote a great blog post about [setting up his site on HTTPS with Caddy](https://luit.eu/post/modern-webserver/).


## Donate?

If you find Caddy useful or if your company is using it, please consider [donating](/donate). Contributors, some of whom are students or are unemployed, volunteer their time and talents to improve Caddy. We do this out of love for helping people make great stuff for the Web.


## Credits

As usual, this release was a team effort. We've had contributors from all over the world, and I'm really happy with the way our community works together. (Feel free to [join the fun](https://github.com/mholt/caddy/issues)!)

Major props to Sebastian Erhart, author of [lego](https://github.com/xenolf/lego) which powers Caddy's magic TLS features. We spent a lot of time trying to make this the best experience possible for you. And if you're interested in using Let's Encrypt on its own, lego is also a pure Go command line ACME client that doesn't have any external dependencies; pretty cool stuff.

In no particular order, other contributions came from Abdulelah Alfuntukh, Luit van Drongelen, Carlisia Campos, tw4452852, Abiola Ibrahim, Michael Banzon, Tatsuhiko Kubo, AJ ONeal, Patel N Dipen, Benny Ng, Dave Goodchild, Austin Cherry, Guilherme Rezende, Bisser Nedkov, Marcelo Magallon, Paulo L F Casaretto, Zac Bergquist, and Karthic Rao. (Phew!) Also props to Erik Howard, jungle-boogie, and others who helped test and debug this version of Caddy. Thanks everyone!


So, we hope you enjoy this new [release](https://github.com/mholt/caddy/releases/tag/v0.8.0) that makes the Web more private and easier to use.
