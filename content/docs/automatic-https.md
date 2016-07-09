---
title: Automatic HTTPS
type: docs
---

<style>
h4 { margin-top: 15px; margin-bottom: -10px; }
table {
	border-collapse: collapse;
	width: 100%;
	margin: 1em 0;
}
th { text-align: left; background: #F2F2F2; }
th, td {
	vertical-align: top;
	padding: 7px;
	border-bottom: 1px solid #E0E0E0;
	font-size: 14px;
}
</style>

Caddy automatically enables HTTPS for all your sites, given that some reasonable criteria are met:

*   The host is not localhost or an IP address
*   The port is not explicitly 80
*   The scheme is not explicitly http
*   TLS is not turned off in site's configuration
*   Certificates and keys are not provided by you
*   Caddy is able to bind to ports 80 and 443

Caddy will also redirect all HTTP requests to their HTTPS equivalent if the plaintext variant of the hostname is not defined in the Caddyfile.

All pertinent assets are fully managed, including renewals—no action is required by you. Here's a 28-second [video](https://www.youtube.com/watch?v=nk4EWHvvZtI) showing how it works:

<iframe style="max-width: 640px;" width="100%" height="480" src="https://www.youtube-nocookie.com/embed/nk4EWHvvZtI?rel=0" frameborder="0" allowfullscreen=""></iframe>

## Things to Know / FAQ

In order to fully enjoy this flagship feature, please read the following.

#### Binding to ports 80 and 443 is required

This usually requires privilege escalation. On Linux systems, you can give Caddy permission to bind to port 80 and 443 without being root using [setcap](http://man7.org/linux/man-pages/man8/setcap.8.html), like so: `setcap cap_net_bind_service=+ep caddy`. Don't forget to configure all relevant firewalls to allow Caddy to use these ports for incoming and outgoing connections! Caddy must have claim on these ports to obtain certificates.

#### The .caddy folder

Caddy will create a folder in your home directory called `.caddy`. It uses this to store and manage cryptographic assets required to serve your site privately over HTTPS. <mark>Your sites' certificates and private keys are stored here. Take care to back up and protect this folder.</mark> If there is no home folder, the .caddy folder is created in the current working directory unless `$CADDYPATH` is set. The home folder is learned from the environment (`$HOME` or `%HOMEPATH%`).

#### Testing, experimenting, and advanced setups

To test your Caddy configuration, make sure you use the `-ca` flag to change the ACME endpoint to a staging or development URL, otherwise you are likely to hit rate limits which can block your access to HTTPS for up to a week. This is especially common when using process managers or containers. Caddy's default CA is [Let's Encrypt](https://letsencrypt.org), which has a staging endpoint that is not subject to the same rate limits.

#### Behind a load balancer or proxy

If Caddy is behind other infrastructure, it may have trouble validating the domain and obtaining certificates. It is your responsibility, then, to ensure SSL certificates are obtained and properly set up on all machines. In most cases, you can use the DNS challenge (described below) to obtain certificates, but this you have to configure manually.

#### Transparency reports

When Caddy obtains a certificate from a CA that publishes certificate transparency logs, it is requisite that your domain name and/or IP address will be included in those logs, as they are not considered private information. (Let's Encrypt is one such CA.) This is a good thing; certificate transparency reports [keep the CAs accountable](https://googleonlinesecurity.blogspot.com/2015/10/sustaining-digital-certificate-security.html).

## DNS Challenge

There are three challenge types by which Caddy can obtain certificates. Caddy can use two of them without any configuration, but another one—the DNS challenge—requires configuration and can be used when the other challenge types would fail. Caddy supports [a number of DNS providers](https://github.com/caddyserver/dnsproviders).

To use the DNS challenge, you must do three things. 1) Download Caddy with your provider plugged in. 2) Tell Caddy which provider to use; this is done in the Caddyfile. 3) Give Caddy credentials to access your account to solve the challenge; this is done with environment variables.

### Enabling the DNS Challenge

In your Caddyfile, you will use the [tls](/docs/tls) directive with the dns keyword like so:

<code class="block"><span class="hl-directive">tls</span> {
	<span class="hl-subdirective">dns</span> <i>provider</i>
}
</code>

Replace "provider" with the name of your DNS provider (in the table below). You will also need to set environment variables with your account credentials:


| Provider Name | Environment Variables to Set                                                |
|---------------|-----------------------------------------------------------------------------|
| cloudflare    | CLOUDFLARE_EMAIL<br>CLOUDFLARE_API_KEY                                        |
| digitalocean  | DO_AUTH_TOKEN                                                               |
| dnsimple      | DNSIMPLE_EMAIL<br>DNSIMPLE_API_KEY                                              |
| dyn           | DYN_CUSTOMER_NAME<br>DYN_USER_NAME<br>DYN_PASSWORD                                  |
| gandi         | GANDI_API_KEY                                                               |
| googlecloud   | GCE_PROJECT                                                                 |
| namecheap     | NAMECHEAP_API_USER<br>NAMECHEAP_API_KEY                                         |
| rfc2136       | RFC2136_NAMESERVER<br>RFC2136_TSIG_ALGORITHM<br>RFC2136_TSIG_KEY<br>RFC2136_TSIG_SECRET |
| googlecloud   | GCE_PROJECT                                                                 |
| route53       | AWS_ACCESS_KEY_ID<br>AWS_SECRET_ACCESS_KEY                                      |
| vultr         | VULTR_API_KEY                                                               |

When you configure the DNS challenge, Caddy will use that challenge exclusively. Note that some providers may be slow to apply changes (on the order of minutes).

## On-Demand TLS

Caddy pilots a new technology called On-Demand TLS. This means Caddy can obtain a certificate for your site during the first TLS handshake for a hostname that does not yet have a certificate.

To enable on-demand TLS, use the `tls` directive with `max_certs`. For example, your Caddyfile might look like this:

<code class="block"><span class="hl-vhost">*.example.com</span>
<span class="hl-directive">proxy</span> <span class="hl-arg">/ localhost:4001 localhost:4002</span>
<span class="hl-directive">tls</span> {
	<span class="hl-subdirective">max_certs</span> 10
}
</code>

This Caddyfile will proxy all requests on subdomains to `example.com` to your backends for the first 10 unique hostnames. This means you can dynamically provision new DNS records, and they will just start working with HTTPS. Unlike wildcard certificates, on-demand certificates are not limited to subdomains.

<mark class="block">**Mitigating abuse:** This feature is intentionally rate-limited. The _max_certs_ property of the [tls](/docs/tls) directive sets a hard limit on how many new certificates are issued this way, so that even over a long period of time, attackers cannot issue unlimited certificates and fill up your disk space.</mark>

On-Demand TLS is a special kind of managed TLS, so all the requirements above still apply except for the one about not providing your own certificate and key: you may supplement on-demand TLS with your own certificates. And like regular managed TLS, HTTP will be redirected to HTTPS.

<mark class="block">**Future support:** This feature relies on the CA issuing certificates without delay. If instantaneous issuance becomes uncommon among ACME CAs, we may discontinue this feature in Caddy.</mark>

Once a certificate is obtained on-demand, it is stored on disk just like any other managed certificates. It is also stored in memory for quick retrieval during future handshakes.

On-Demand TLS is subject to these rate limits:

*   At most one certificate challenge happens at a time.
*   After 10 certificates are successfully obtained, new certificate challenges will not happen until 10 minutes after the last successful challenge.
*   A name that fails a challenge will not be allowed to be attempted again for 5 minutes.

Note that rate limits are reset when the process exits. Using the `-log` flag is recommended, since all certificate challenges are logged.

<mark class="block">**Testing your configuration:** If your CA has a staging endpoint, it is _strongly_ recommended that you use it to test your configuration. Let's Encrypt is Caddy's default CA, and it has a staging endpoint that is not subject to tight rate limits.</mark>

The rest of this page explains more details about automatic HTTPS, but it is not required knowledge for using Caddy.

## Obtaining Certificates

To serve a site over HTTPS, a valid SSL certificate is required from a trusted certificate authority (CA). When Caddy starts, it obtains certificates for eligible sites from [Let's Encrypt](https://letsencrypt.org). The following process is nearly entirely _automatic_ and _on by default_.

If necessary, Caddy creates an account on the CA's server with (or without) your email address. Caddy may have to prompt you for an email address if it is not able to find one from the Caddyfile, in the command line flags, or on disk from a previous run. Also, if the CA's legal agreements have changed, you may be prompted to agree to them if you did not already do so with the `-agree` flag.

Once the formalities are taken care of, Caddy generates a private key and a Certificate Signing Request (CSR) for each site. The private keys never leave the server and are safely stowed on your file system.

Caddy establishes a link with the CA's server. A brief cryptographic transaction takes place to prove that Caddy really is serving the sites it says it is. Once the CA server verifies this, it sends the certificate for that site over the wire to Caddy, which tucks it neatly away in the .caddy folder.

This process usually takes a few seconds per domain, so once a certificate has been obtained for a site, it is simply loaded from disk and reused the next time Caddy is run. In other words, this delayed startup is a one-time event. If an existing certificate needs to be renewed, Caddy takes care of it right away.

## Renewing Certificates

Certificates are only valid for a limited time, so Caddy checks each certificate on a regular basis and automatically renews certificates that expire soon. If renewal fails, Caddy will keep trying.

Once Caddy gets the new certificate, it swaps out the old certificate with the new one. This replacement incurs zero downtime.

## Revoking Certificates

Caddy does not automatically revoke a certificate, but you can do this with the `-revoke` option, specifying the domain name. This is only necessary if your site's private key or the certificate authority was compromised. Upon revocation, Caddy deletes the certificate file from disk to prevent it from being used at next run.

## OCSP Stapling

Caddy staples OCSP information of all certificates containing an OCSP link to protect the privacy of your sites' clients and reduce stress on OCSP servers. The cached OCSP status is checked on a regular basis, and if there is a change, the server will staple the new response.
