---
title: Let's Encrypt Progress Report
author: Matt Holt
date: 2015-10-20 08:00:00
---

As of this week on the letsencrypt dev branch, Caddy serves all non-loopback hosts over HTTPS automatically. This makes Caddy the first web server to fully manage encryption assets for all your sites *and use them by default*.

For example:

<code class="block"><span class="hl-vhost">example.com</span>
<span class="hl-directive">root</span> <span class="hl-arg">/www/example.com</span>
<span class="hl-directive">gzip</span></code>

This Caddyfile serves **<span style="color: #10A210;">https</span>://example.com** and redirects all requests for **http://example.com** to the HTTPS version. *You don't have to configure anything.*

<br>
<div style="text-align: center;"><iframe style="max-width: 640px;" width="100%" height="372" src="https://www.youtube-nocookie.com/embed/9WAn4Q2-Amw?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe></div>
<br>

How is this possible? We've been closely monitoring the progress of [Let's Encrypt](https://letsencrypt.org), who have been [developing](https://letsencrypt.org/howitworks/technology/) a new protocol for the automatic issuance, renewal, and revocation of free, trusted SSL certificates. The [ACME specification](https://github.com/letsencrypt/acme-spec) is nearly ready, and just [yesterday](https://letsencrypt.org/2015/10/19/lets-encrypt-is-trusted.html), Let's Encrypt got [cross-signed](https://letsencrypt.org/2015/06/04/isrg-ca-certs.html) by a widely-trusted CA, making free encryption a possibility for anyone with an email address. (Their general availability is slated for next month.)

This is amazing, because the current process for obtaining a single valid, trusted SSL certificate for your site is this: First, you have to log into your server and generate a private key and Certificate Signing Request (CSR). You have to properly secure your key, then purchase a certificate from some vendor with a horrible UI. You paste in your CSR, fill out a form, and they send you an email someday, to an account you only use for domain validation. You click a link to verify ownership of the email address you never use otherwise, then hopefully within the next week or so, the vendor emails your certificate to you. Then you download and extract the file, concatenate the intermediate certificates, and upload the resulting bundle to your server. Then you log into your server, put the certificate in place, and configure your web server to use it. Oh, and don't mess up, especially if you've enabled advanced security features like HSTS or HPKP.

Repeat that process every year, and congratulations: your site is HTTPS.


## Getting Encryption to the Masses

Now that a free and automated certificate authority is almost in place, how do we get people to use it? The appeal is obvious to those of us concerned about Internet security and privacy. But that audience is already encrypting (they're just paying for it). How do we reach the other ~70% of web traffic that is unencrypted?

I believe the answer is to make HTTPS the default behavior of web servers.

Let's Encrypt and its community are building [a command line client](https://github.com/letsencrypt/letsencrypt) that manages certs and configures Apache and NGINX servers for you. This is awesome since most site owners use those.

But it's still a step removed from where we want to be.

To take the benefits of Let's Encrypt the extra mile, we are building their automated process *directly into the web server* and removing the last excuse for not encrypting your website.

Sebastian Erhart has been developing [a Go library that implements the ACME client](https://github.com/xenolf/lego) spec so that Caddy (and other Go programs) can use Let's Encrypt with ease. With the proliferation of Go, we hope this will give people unprecedented easy access to encryption online.


## Too Important to be Optional

Your security and privacy in the wild, wild Web are too important to be turned off by default. So with Caddy, the default setting will be HTTPS.

You can expect this feature to roll out in mainstream releases of Caddy next month, with special developer betas sooner.

We're very excited about this. If you also believe that security and privacy are important, I invite you to [get involved with Caddy](https://github.com/mholt/caddy/blob/master/CONTRIBUTING.md), even if that just means using it and submitting feedback or telling others about it. Please also consider [donating to the project developers](/donate) and also to the [Internet Security Research Group](https://letsencrypt.org/isrg/), the organization behind Let's Encrypt.
