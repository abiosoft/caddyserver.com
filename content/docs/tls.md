---
title: tls
type: docs
directive: true
---

tls configures HTTPS connections. Since HTTPS is enabled automatically, this directive is mainly used to explicitly override default settings; use with care.

Caddy supports SNI (Server Name Indication), so you can serve multiple HTTPS sites from the same port on your machine. In addition, Caddy implements OCSP stapling for all qualifying certificates.

The tls directive will ignore sites that are explicitly defined to be http:// or are on port 80\. This allows you to use the tls directive in a server block that is shared with both HTTP and HTTPS sites.

If not all the hostnames are not known when starting the server, you can use the [On-Demand TLS](/docs/automatic-https#on-demand) feature, which issues certificates during the TLS handshake rather than at startup.

### Syntax

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg">off</span></code>

Disables TLS for the site. Not recommended unless you have a good reason. With TLS off, automatic HTTPS is also disabled, so the default port (2015) will not be changed.

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg"><i>email</i></span></code>

*   **email** is the email address to use with which to generate a certificate with a trusted CA. By providing an email here you will not be prompted when you run Caddy.

Although the above syntax is not needed to enable TLS, it allows you to specify the email address used for your CA account, instead of prompting for one or using another one from a previous run.

To use Caddy with your own certificate and key:

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg"><i>cert key</i></span></code>

*   **cert** is the certificate file. If the certificate is signed by a CA, this certificate file should be a bundle: a concatenation of the server's certificate followed by the CA's certificate (root certificate usually not necessary).
*   **key** is the server's private key file which matches the certificate file.

You can use this directive multiple times to specify multiple certificate and key pairs.

Or to have Caddy generate and use an untrusted, self-signed certificate in memory:

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg">self_signed</span></code>

The above syntaxes use Caddy's default TLS settings with your own certificate and key or a self-signed certificate, which should be sufficient in most cases.

Advanced users may open a settings block for more control, optionally specifying their own certificate and key:

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg">[<i>cert key</i>]</span> {
    <span class="hl-subdirective">protocols</span> <i>min max</i>
    <span class="hl-subdirective">ciphers</span>   <i>ciphers...</i>
    <span class="hl-subdirective">clients</span>   <i>[request|require|verify_if_given]</span> clientcas...</i>
	<span class="hl-subdirective">load</span>      <i>dir</i>
	<span class="hl-subdirective">max_certs</span> <i>limit</i>
	<span class="hl-subdirective">key_type</span>  <i>type</i>
	<span class="hl-subdirective">dns</span>       <i>provider</i>
}</code>

*   **cert** and **key** are the same as above.
*   **min** and **max** are the minimum and maximum protocol versions to support, respectively. See below for valid values.
*   **ciphers...** is a list of space-separated ciphers that will be supported. If you list any, only the ones you specify will be allowed. See below for valid values.
*   **clientcas...** is a list of space-separated client root CAs used for verification during TLS client authentication. If used, clients will be asked to present their certificate by their browser, which will be verified against this list of client certificate authorities. A client will not be allowed to connect if their certificate was not signed by one of these root CAs. You may modify the strictness of client authentication using one of the keywords before the list of client CAs:
    *   **request** merely asks a client to provide a certificate, but will not fail if none is given or if an invalid one is presented.
    *   **require** requires a client certificate, but will not verify it.
    *   **verify_if_given** will not fail if none is presented, but reject all that do not pass verification.
    *   The default, if no flag is set but a CA file found, is to do both: to require client certificates and validate them.
*   **dir** is a directory from which to load certificates and keys. The entire directory and its subfolders will be walked in search of .pem files. Each .pem file must contain the PEM-encoded certificate (chain) and key blocks, concatenated together.
*   **limit** puts a limit on the number of certificates allowed to be issued on demand (during TLS handshake). Specifying this value enables [On-Demand TLS](/docs/automatic-https#on-demand). It must be a positive integer. This value gets reset after the process exits (but is preserved through reloads).
*   **type** is the type of key to use when generating keys for certificates (only applies to managed orTLS or self-signed certificates). Valid values are rsa2048, rsa4096, rsa8192, p256, and p384\. Default is currently rsa2048.
*   **provider** is the name of a DNS provider; specifying it enables the [DNS challenge](/docs/automatic-https#dns-challenge). Note that you need to give credentials for it to work.

### Protocols

The following protocols are supported, in descending order of preference:

*   tls1.2 (default **max**)
*   tls1.1 (default **min**)
*   tls1.0

Note that setting the minimum protocol version too high will restrict the clients which are able to connect, but with the benefit of better privacy.

Supported protocols and default protocol versions may be changed at any time.

### Cipher Suites

The following cipher suites are currently supported, in descending order of preference:

*   ECDHE-ECDSA-AES256-GCM-SHA384
*   ECDHE-RSA-AES256-GCM-SHA384
*   ECDHE-ECDSA-AES128-GCM-SHA256
*   ECDHE-RSA-AES128-GCM-SHA256
*   ECDHE-RSA-AES256-CBC-SHA
*   ECDHE-RSA-AES128-CBC-SHA
*   ECDHE-ECDSA-AES256-CBC-SHA
*   ECDHE-ECDSA-AES128-CBC-SHA
*   RSA-AES256-CBC-SHA
*   RSA-AES128-CBC-SHA
*   ECDHE-RSA-3DES-EDE-CBC-SHA
*   RSA-3DES-EDE-CBC-SHA

<mark class="block">Note: The HTTP/2 spec blacklists over 275 cipher suites for security reasons. Unless you know what you're doing, it's best to accept the default cipher suite settings.</mark>

Cipher suites may be added to or removed from Caddy at any time. Similarly, the default cipher suites may be changed at any time.


### Examples

Remember, TLS is enabled by default, and this directive is not usually needed! These examples are for advanced users who manage certificates manually or need custom settings.


Serve with HTTPS using a certificate and private key located one folder up:

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg">../cert.pem ../key.pem</span></code>

Obtain certificates during TLS handshakes as needed, with a hard limit of 10 new certificates:

<code class="block"><span class="hl-directive">tls</span> {
	<span class="hl-subdirective">max_certs</span> 10
}</code>

Load all certificates and keys from .pem files found in /www/certificates:

<code class="block"><span class="hl-directive">tls</span> {
	<span class="hl-subdirective">load</span> /www/certificates
}</code>

Serve a site with a self-signed certificate (untrusted by browsers, but convenient for local development):

<code class="block"><span class="hl-directive">tls</span> <span class="hl-arg">self_signed</span></code>
