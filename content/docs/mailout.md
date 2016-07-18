---
title: mailout
type: docs
directive: true
plugin: true
link: https://github.com/SchumacherFM/mailout
---

<mark class="block">Note: This addon is in beta phase. Please report bugs and submit your feedback to the maintainer.</mark>

SMTP client middleware with a REST API for sending emails with optional PGP encryption.

Feature overview:

*   Send the email optionally [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) encrypted
*   Partly RESTful API designed end point
*   Support for plain text and HTML emails
*   Rate limitation based on a [Token Bucket algorithm](http://en.wikipedia.org/wiki/Token_bucket)
*   Full support for SMTP with SSL encryption (Port 465) or TLS encryption (Port 587). Of course unencrypted sending on Port 25 has not been deactivated.
*   Optional server side logging of sent emails. When using PGP, the emails gets logged after encryption. No plain text will be written to disk.

The mailout directive starts a service routine that runs during the lifetime of the server. This background service manages the sending of the emails. It opens a connection to the SMTP server, sends the email and then waits for 30 seconds if another email should be sent out. If no email gets transferred through the channel, the service routine closes the connection to the SMTP server. For the next email the connection gets reopened.

During the start phase of the Caddy binary the mailout setup routine tries to ping the SMTP server and checks if the log in credentials satisfy the authentication system. If that ping fails, mailout service won't be available.

All errors related to sending emails get logged in the mailout specific error log file. The JSON API will not report any failed sending of an email. If you enable email logging, no email gets lost despite SMTP errors. If you do not provide a directory for email and error logging you will leave no trace on the hard disk for a sent out email, theoretically.

### Syntax

The configuration options are as followed:

<code class="block"> <span class="hl-directive">mailout</span> <span class="hl-arg">[<i>endpoint</i>]</span> {
    <span class="hl-subdirective">maillog</span>  <i>[path/to/logdir]</i>
    <span class="hl-subdirective">errorlog</span> <i>[path/to/logdir]</i><br>
    <span class="hl-subdirective">to</span>  <i>["email-address1, ..."]</i>
    <span class="hl-subdirective">cc</span>  <i>["email-address2, ..."]</i>
    <span class="hl-subdirective">bcc</span> <i>["email-addressN, ..."]</i><br>
    <span class="hl-subdirective">[email-address1]</span> <i>[path/to/pgp1.pub|ENV:MY_PGP_KEY_PATH1|https://keybase.io/user1/key.asc]</i>
    <span class="hl-subdirective">[email-address2]</span> <i>[path/to/pgp2.pub|ENV:MY_PGP_KEY_PATH2|https://keybase.io/user2/key.asc]</i>
    <span class="hl-subdirective">[email-addressN]</span> <i>[path/to/pgpN.pub|ENV:MY_PGP_KEY_PATHN|https://keybase.io/userN/key.asc]</i><br>
    <span class="hl-subdirective">subject</span> <i>"Email from {&#123;.variable1}} {&#123;.variableN}}"</i>
    <span class="hl-subdirective">body</span> <i>path/to/tpl.[txt|html]</i><br>
    <span class="hl-subdirective">username</span> <i>"ENV:MY_SMTP_USERNAME|username"</i>
    <span class="hl-subdirective">password</span> <i>"ENV:MY_SMTP_PASSWORD|password"</i>
    <span class="hl-subdirective">host</span>     <i>"ENV:MY_SMTP_HOST|hostname|IP address"</i>
    <span class="hl-subdirective">port</span>     <i>ENV:MY_SMTP_PORT|25|465|587</i><br>
    <span class="hl-subdirective">ratelimit_interval</span> <i>[interval]</i>
    <span class="hl-subdirective">ratelimit_capacity</span> <i>[number]</i>
}</code>

*   **endpoint** Can be any path but your POST request must match it. Default path: _/mailout_
*   **maillog** Specify a directory, which gets created recursively, and emails will be written in there, as a backup. Leaving the maillog setting empty does not log anything. Every sent email is saved into its own file. Strict file permissions apply.
*   **errorlog** Specify a directory, which gets created recursively, and errors gets logged in there. Leaving the errorlog setting empty does not log anything. Strict file permissions apply.
*   **to, cc, bcc** Multiple email addresses must be separated by a colon and within double quotes. A single email address does not need to be put into double quotes.
*   **email-address** if provided mails get encrypted. Set a path to a file, an environment variable or an URL to a key on a HTTPS site. Key = email address; value = PGP Key.
*   **subject** Has the same functionality as the body template, but text only. Please keep subject short and precise.
*   **body** Text or HTML template stored on the hard disk of your server. More details below.
*   **username, password, host** Access credentials to the SMTP server.
*   **port** Plain text on port 25, SSL uses port 465, for TLS use port 587\. Internally for TLS the host name gets verified with the certificate of the SMTP server.
*   **ratelimit_interval** the duration in which the capacity can be consumed. A duration string is a possibly signed sequence of decimal numbers, each with optional fraction and a unit suffix, such as "300ms", "1.5h" or "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h". Default: 24h
*   **ratelimit_capacity** the overall capacity within the interval. Default: 1000

The default filename for an encrypted message attached to an email is: _encrypted.gpg_. The extension `.gpg` has been chosen to allow easy handling with [https://www.gnupg.org](https://www.gnupg.org). If you don't like this file name and/or extension you can overwrite it with the key _publickeyAttachmentFileName_.

**Note on sensitive information leakage** when using PGP with multiple email message receivers: For each email address in the to, cc and bcc field you must add a public PGP key, if not, emails to recipients without a public key won't be encrypted. For all email addresses with a PGP key, the mailout middleware will send a separated email encrypted with the key of the receiver.

### Email Rendering

The rendering engine for the email templates depends on the suffix of the template file name.

*   **.txt**: Plain text template language [https://golang.org/pkg/text/template/](https://golang.org/pkg/text/template/)
*   **.html**: HTML template language [https://golang.org/pkg/html/template/](https://golang.org/pkg/html/template/)

### HTML Form

Create a simple HTML form with some JavaScript and AJAX functions. Mandatory input field is _email_. Optional recommended field: _name_. Those two fields will be later joined to create the _From:_ header of an email.

```html
<div id="contactThankYou" style="display:hidden;">Thank you for contacting us!</div>
<form action="#" id="myContactForm" method="POST">
  <div class="row uniform 50%">
    <div class="6u 12u$(xsmall)">
      <input type="text" name="name" id="name"
             placeholder="Your name" required/>
    </div>
    <div class="6u$ 12u$(xsmall)">
      <input type="email" name="email" id="email"
             placeholder="Your email address" required/>
    </div>
    <div class="12u$">
      <textarea name="message" id="message" placeholder="Type here your text"
                rows="4" required></textarea>
    </div>
    <input type="hidden" name="user_agent" value="Will be filled out via JavaScript"/>
    <ul class="actions">
      <li><input type="submit" value="Submit"/></li>
    </ul>
  </div>
</form>
```

If you do not provide the name field, only the email address will be used.

### JavaScript

A jQuery AJAX handler might look like (untested):

```javascript
$(document).ready(function () {
    $('#myContactForm').submit(function (event) {
      $.ajax({
        type     : 'POST',
        url      : 'https://myCaddyServer.com/mailout',
        data     : $('#myContactForm').serialize(),
        dataType : 'json',
        encode   : true
      })
      .done(function (data) {
        console.log(data);
        $('#contactThankYou').show();
        $('#myContactForm').hide();
      })
      .fail(function () {
          alert("error");
      });
      event.preventDefault();
    });
});
```
An email template for an outgoing mail may look like in plain text:

```
Hello,

Please find below a new contact:

Name {{.Form.Get "name"}}
Email {{.Form.Get "email"}}

Message:
{{.Form.Get "message"}}

User Agent: {{.Form.Get "user_agent"}}
```

A simple template which lists all posted variables in random order:

```
{{range $key, $value := .Form }}
  {{$key}}:   {{$value}}
{{end}}
```

Expert Pro-Tip: The Request struct can also be accessed in the template via _.Request_ Available fields in the [Go docs](https://golang.org/pkg/net/http/#Request).

### JSON API

You can query the mailout endpoint only with a HTTP POST request.

Server response on success (Status 200 OK):

```json
{"code":200}
```

Server response on error (Status 422 Unprocessable Entity):

```json
{"code":422,"error":"Invalid email address: \"doe.john40nonexistantServer.email\""}
```

Server response on non-POST requests (Status 405 Method Not Allowed):

```json
{"code":405,"error":"Method Not Allowed"}
```

Server response on form parse error (Status 400 Bad Request):

```json
{"code":400,"error":"Bad request"}
```

Server response on reaching the rate limit (Status 429 Too Many Requests):

```json
{"code":429,"error":"Too Many Requests"}
```

Server response on internal errors:

```
500 Internal Server Error
```

### Gmail / Google Apps

If you use Gmail as outgoing server these pages can help for troubleshooting:

*   [Google SMTP settings to send mail from a printer, scanner, or app](https://support.google.com/a/answer/176600)
*   [Allowing less secure apps to access your account](https://support.google.com/accounts/answer/6010255)
