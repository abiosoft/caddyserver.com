---
title: log
type: docs
directive: true
---

log enables request logging. The request log is also known from some vernaculars as an access log.

### Syntax

<code class="block"><span class="hl-directive">log</span></code>

*   With no arguments, an access log is written to access.log in the common log format for all requests (base path = /).

<code class="block"><span class="hl-directive">log</span> <span class="hl-arg"><i>file</i></span></code>

*   **file** is the log file to create (or append to). The base path is assumed to be /.

<code class="block"><span class="hl-directive">log</span> <span class="hl-arg"><i>path file </i>[<i>format</i>]</span></code>

*   **path** is the base path to match in order to be logged
*   **file** is the log file to create (or append to), relative to current working directory
*   **format** is the log format to use (default is Common Log Format)


### Log File

The log file can be any filename. It could also be `stdout` or `stderr` to write the log to the console, or `syslog` to write to the system log (except on Windows). If the log file does not exist beforehand, Caddy will create it before appending to it.

### Log Format

You can specify a custom log format with any [placeholder](/docs/placeholders) values. Log supports both request and response placeholders.

### Log Rotation

If you enable log rotation, log files will be automatically maintained when they get large or old. You can use rotation by opening a block on your first line, which can be any of the variations described above:

<code class="block"><span class="hl-directive">log</span> <span class="hl-arg">...</span> {
    <span class="hl-subdirective">rotate</span> {
		<span class="hl-subdirective">size</span> <i>maxsize</i>
		<span class="hl-subdirective">age</span>  <i>maxage</i>
		<span class="hl-subdirective">keep</span> <i>maxkeep</i>
	}
}</code>

*   **maxsize** is the maximum size of a log file in megabytes (MB) before it gets rotated. Default is 100 MB.
*   **maxage** is the maximum age of a rotated log file in days, after which it will be deleted. Default is to never delete old files because of age.
*   **maxkeep** is the maximum number of rotated log files to keep. Default is to retain all old log files.

### Examples

Log all requests to a file:

<code class="block"><span class="hl-directive">log</span> <span class="hl-arg">/var/log/access.log</span></code>

Custom log format:

<code class="block"><span class="hl-directive">log</span> <span class="hl-arg">/ ../access.log "{proto} Request: {method} {path}"</span></code>

With rotation:

<code class="block"><span class="hl-directive">log</span> <span class="hl-arg">access.log</span> {
	<span class="hl-subdirective">rotate</span> {
		<span class="hl-subdirective">size</span> 100 <span class="hl-comment"># Rotate after 100 MB</span>
		<span class="hl-subdirective">age</span>  14  <span class="hl-comment"># Keep log files for 14 days</span>
		<span class="hl-subdirective">keep</span> 10  <span class="hl-comment"># Keep at most 10 log files</span>
	}
}</code>
