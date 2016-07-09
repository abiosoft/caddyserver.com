---
title: basicauth
type: docs
directive: true
---

basicauth implements HTTP Basic Authentication. Basic Authentication can be used to protect directories and files with a username and password. Note that basic auth is *not secure* over plain HTTP. Even with HTTPS, which encrypts the header (including the credentials), the security of basic auth is disputed. Use discretion when deciding what to protect with HTTP Basic Authentication.

When a user requests a resource that is protected, the browser will prompt the user for a username and password if they have not already supplied one. If the proper credentials are present in the Authorization header, the server will grant access to the resource. If the header is missing or the credentials are incorrect, the server will respond with HTTP 401 Unauthorized.

This directive allows use of .htpasswd files by prefixing the password argument with `htpasswd=` and the path to the .htpasswd file to use. <mark>Support for .htpasswd is for legacy sites only and may be removed in the future; do not use .htpasswd with new sites.</mark>

### Syntax

<code class="block"><span class="hl-directive">basicauth</span> <span class="hl-arg"><i>path username password</i></span></code>

*   **path** is the file or directory to protect
*   **username** is the username
*   **password** is the password

This syntax is convenient for protecting a single file or base path/directory. For multiple resources, consider the following variation:

<code class="block"><span class="hl-directive">basicauth</span> <span class="hl-arg"><i>username password</i></span> {
    <span class="hl-subdirective"><i>resources</i></span>
}</code>

*   **username** is the username
*   **password** is the password
*   **resources** is a list of files/directories to protect, one per line

### Examples

Protect all files in /secret so only Bob can access them with the password "hiccup":

<code class="block"><span class="hl-directive">basicauth</span> <span class="hl-arg">/secret Bob hiccup</span></code>

Protect multiple files and directories so Mary Lou has access with her password "milkshakes":

<code class="block"><span class="hl-directive">basicauth</span> <span class="hl-arg">"Mary Lou" milkshakes</span> {
    <span class="hl-subdirective">/notes-for-mary-lou.txt</span>
    <span class="hl-subdirective">/marylou-files</span>
    <span class="hl-subdirective">/another-file.txt</span>
}</code>
