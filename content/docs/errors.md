---
title: errors
type: docs
directive: true
---

errors allows you to set custom error pages and enable error logging.

By default, error responses (HTTP status >= 400) are not logged and the client receives a plaintext error message.

Using an error log, the text of each error will be recorded so you can determine what is going wrong without exposing those details to the clients. With error pages, you can present custom error messages and instruct your visitor what to do.

### Syntax

<code class="block"><span class="hl-directive">errors</span> <span class="hl-arg">[<i>logfile</i>]</span></code>

*   **logfile** is the path to the error log file to create (or append to), relative to the current working directory. It can also be `stdout` or `stderr` to write to the console, `syslog` to write to the system log (except on Windows), or `visible` to write the error (including full stack trace, if applicable) to the response. Writing errors to the response is NOT advised except in local debug situations. Default is `stderr`.

The above syntax will simply enable error reporting on the server. To specify custom error pages, open a block:

<code class="block"><span class="hl-directive">errors</span> {
    <span class="hl-subdirective"><i>what</i></span> <i>where</i>
}</code>

*   **what** can be an HTTP status code (4xx, 5xx, or `*` for default error page) or log.
*   **where** depends on what. If an error page, it is the HTML file of the error page (path is relative to site root). If log, it is the path to the log file (as described above) and you can enable [rotation](/docs/log#rotate) to manage the log files.

### Examples

Log errors into a file in the parent directory:

<code class="block"><span class="hl-directive">errors</span> <span class="hl-arg">../error.log</span></code>

Log errors but also serve custom error pages:


<code class="block"><span class="hl-directive">errors</span> {
	<span class="hl-subdirective">log</span> ../error.log
	<span class="hl-subdirective">404</span> 404.html <span class="hl-comment"># Not Found</span>
	<span class="hl-subdirective">500</span> 500.html <span class="hl-comment"># Internal Server Error</span>
}</code>

Make errors visible to the client (for debugging only):

<code class="block"><span class="hl-directive">errors</span> <span class="hl-arg">visible</span></code>

Maintain error log files automatically:

<code class="block"><span class="hl-directive">errors</span> {
	<span class="hl-subdirective">log</span> error.log {
		<span class="hl-subdirective">size</span> 50 <span class="hl-comment"># Rotate after 50 MB</span>
		<span class="hl-subdirective">age</span>  30 <span class="hl-comment"># Keep rotated files for 30 days</span>
		<span class="hl-subdirective">keep</span> 5  <span class="hl-comment"># Keep at most 5 log files</span>
	}
}</code>
