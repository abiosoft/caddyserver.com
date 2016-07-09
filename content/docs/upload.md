---
title: upload
type: docs
directive: true
plugin: true
link: https://github.com/wmark/caddy.upload
---

upload enables you to upload files, such as build artifacts, to your site.

<mark class="block">Caution: Use this with its built-in authentication, TLS client certificates, or a different authentication plugin such as [jwt](/docs/jwt).</mark>

*   uses HTTP PUT and POST for uploads
*   supports HTTP MOVE and DELETE
*   imposes limits on filenames:  
    *   rejects those that are not conforming to Unicode NFC or NFD
    *   rejects any comprised of unexpected alphabets ϟ(ツ)╯
*   checks request authorization using scheme <q>Signature</q>
*   can be configured to silently discard unauthorized requests
*   (Linux only) files appear after having been written completely, not before
*   works with Caddy's [browse](/docs/browse) plugin

Warnings:

*   Unless you use TLS with connections to your upload destination your data and any authorization headers can be intercepted by third parties. The authorization header is valid for some seconds and can be replayed: Used by a third party to upload files on your behalf.
*   This plugin echoes errors to the uploader that are thrown by your filesystem implementation. Your directory structure could be revealed.


### Syntax

<code class="block"><span class="hl-directive">upload</span> <span class="hl-arg"><i>path</i></span> {
	<span class="hl-subdirective">to</span>                  <i>"directory"</i>
	<span class="hl-subdirective">yes_without_tls</span>
	<span class="hl-subdirective">filenames_form</span>      <i>none|NFC|NFD</i>
	<span class="hl-subdirective">filenames_in</span>        <i>u0000–uff00 [u0000–uff00| …]</i>
	<span class="hl-subdirective">hmac_keys_in</span>        <i><em>keyID_0=</em>base64(binary) [keyID_n=base64(binary) | …]</i>
	<span class="hl-subdirective">timestamp_tolerance</span> <i>0..32</i>
	<span class="hl-subdirective">silent_auth_errors</span>
}</code>

#### Required Settings

*   **path** is the _scope_ below which the plugin will react to any upload requests. It will be stripped and no part of any resulting files and directories.
*   **to** is an existing target directory. Must be in quotes. When using Linux it is recommended to place this on a filesystem which supports _O_TMPFILE_, such as (but not limited to) _ext4_ or _XFS_.

#### Optional Settings

*   **yes_without_tls** must be set if the plugin is used on a location or host without TLS.
*   **filenames_form**: if given, filenames (this includes directories) that are not conforming to Unicode NFC or NFD will be rejected. Set this to one of said values when you get errors indicating that your filesystem does not convert names properly. (If in doubt, go with NFC; on Mac PCs with NFD.) The default is to not enforce anything.
*   **filenames_in** allows you to limit filenames to specified Unicode ranges. The ranges' bounds must be given in hexadecimal and start with letter `u`. Use this setting to prevent users from uploading files in, for example, Cyrillic when all you like to see is Latin and/or Chinese alphabets.

#### Optional Settings (Authorization)

*   **hmac_keys_in** is a space-delimited list of key=value elements. The _key_ is the KeyID, which could identify the uploading entity and which is a reference to a shared secret, the _value_. The latter is binary data, encoded using _base64_, with a recommended length of 32 octets.
*   **timestamp_tolerance** sets the validity of a request with authorization, and is used to account for clock drift difference between the uploader's and the server's computer. Always being an order of 2, its default value is 2 (as in: ± two seconds). Set this to 1 or 0 with reliably synchronized clocks.
*   **silent_auth_errors** results in the plugin returning no HTTP Errors. Instead, the request will be handed over to the next middleware, which then will most probably return a HTTP Error of its own. This is a cheap way to obscure that your site accepts uploads.

### Tutorial

Start by adding this to your Caddyfile:`

<code class="block"><span class="hl-directive">upload</span> <span class="hl-arg">/web/path</span> {
	<span class="hl-subdirective">to</span> <i>"/var/tmp"</i>
}</code>

… and upload one file, using _bash_ and _curl_:

```bash
# HTTP PUT
curl \
  -T /etc/os-release \
  https://127.0.0.1/web/path/from-release
```

… or more files in one go (sub-directories will be created as needed):

```bash
# HTTP POST
curl \
  -F gitconfig=@.gitconfig \
  -F id_ed25519.pub=@.ssh/id_ed25519.pub \
  https://127.0.0.1/web/path/
```

… which you then can move and delete like this:

```bash
# MOVE is 'mv'
curl -X MOVE \
  -H "Destination: /web/path/to-release" \
  https://127.0.0.1/web/path/from-release

# DELETE is 'rm -r'
curl -X DELETE \
  https://127.0.0.1/web/path/to-release
```

### Authorization Scheme <q>Signature</q>

This plugin comes with support for request authorization scheme _Signature_, but does not support its _realms_ or any other _algorithm_ than _hmac-sha256_.

A pre-shared secret, referenced by _keyId_ in the header, is used together with a nonce—the concatenation of the current Unix time and a free-form string— in a HMAC scheme. In the end a header _Authorization_ is sent formatted like this along with the two latter values:

```
Authorization: Signature keyId="(key_id)",algorithm="hmac-sha256",headers="timestamp token",signature="(see below)"
Timestamp: (current UNIX time)
Token: (some chars, to promote the timestamp to a full nonce)
```

You can generate new keys easily on the shell:

```bash
SECRET="$(openssl rand -base64 32)"

# printf "%s\n" "${SECRET}"
# TWF0dCBIb2x0IGRvZXNuJ3QgdXBkYXRlIGhpcyBNYWM=
```

A full script for uploading something would be:

```bash
#!/usr/bin/env bash

set -euo pipefail

# hmac_keys_in mark=Z2VoZWlt
#
KEYID="mark"
SECRET="geheim"

TIMESTAMP="$(date --utc +%s)"
# length and contents are not important, "abcdef" would work as well
TOKEN="$(cat /dev/urandom | tr -d -c '[:alnum:]' | head -c $(( 32 - ${#TIMESTAMP} )))"

SIGNATURE="$(printf "${TIMESTAMP}${TOKEN}" \
             | openssl dgst -sha256 -hmac "${SECRET}" -binary \
             | openssl enc -base64)"

# order does not matter; any skipped fields in Authorization will be set to defaults
curl -T \
	--header "Timestamp: ${TIMESTAMP}" \
	--header "Token: ${TOKEN}" \
	--header "Authorization: Signature keyId='${KEYID}',signature='${SIGNATURE}'" \
	"filename" "url"
```

### Configuration Examples

A host used by someone in Central and West Europe would be configured like this
to accept filenames in Latin with some Greek runes and a few mathematical symbols:

<code class="block"><span class="hl-directive">upload</span> <span class="hl-arg"><i>/college/curriculum</i></span> {
	<span class="hl-subdirective">to</span>                  <i>"/home/ellen_baker/inbox"</i>
	<span class="hl-subdirective">filenames_form</span>      <i>NFC</i>
	<span class="hl-subdirective">filenames_in</span>        <i>u0000–u007F u0100–u017F u0391–u03C9 u2018–u203D u2152–u217F</i>
}</code>

A host for Linux distribution packages would be more restrictive:

<code class="block"><span class="hl-directive">upload</span> <span class="hl-arg"><i>/binhost/gentoo</i></span> {
	<span class="hl-subdirective">to</span>                  <i>"/var/portage/packages"</i>
	<span class="hl-subdirective">filenames_in</span>        <i>u0000–u007F</i>
	<span class="hl-subdirective">hmac_keys_in</span>        <i>hina=aGluYQ==</i>
	<span class="hl-subdirective">timestamp_tolerance</span> <i>0</i>
}</code>

… while someone in East Asia would share space on his blog with three friends:

<code class="block"><span class="hl-directive">upload</span> <span class="hl-arg"><i>/wp-uploads</i></span> {
	<span class="hl-subdirective">to</span>                  <i>"/var/www/senpai/wp-uploads"</i>
	<span class="hl-subdirective">filenames_in</span>        <i>u0000–u007F u0100–u017F u0391–u03C9 u2018–u203D u3000–u303f u3040–u309f u30a0–u30ff u4e00–9faf uff00–uffef</i>
	<span class="hl-subdirective">hmac_keys_in</span>        <i>yui=eXVp hina=aGluYQ== olivia=b2xpdmlh james=amFtZXM=</i>
	<span class="hl-subdirective">timestamp_tolerance</span> <i>3</i>
	<span class="hl-subdirective">silent_auth_errors</span>
}</code>

### See Also

You can find a very nice overview of Unicode Character ranges here: [http://jrgraphix.net/research/unicode_blocks.php](http://jrgraphix.net/research/unicode_blocks.php "Unicode Ranges displayed pleasantly") Here is the official list of Unicode blocks (no pictograms, only names): [http://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt](http://www.unicode.org/Public/UCD/latest/ucd/Blocks.txt "official list of Unicode blocks") For _Authorization: Signature_ please see:

*   [https://tools.ietf.org/html/draft-cavage-http-signatures-05](https://tools.ietf.org/html/draft-cavage-http-signatures-05 "draft at the IETF")
*   [github.com/joyent/gosign](https://github.com/joyent/gosign "gosign by Joyent for Golang") is an implementation in Go
*   [github.com/joyent/node-http-signature](https://github.com/joyent/node-http-signature "node-http-signature for NodeJS") for Node.js
