---
title: rewrite
type: docs
directive: true
---

rewrite performs internal URL rewriting. This allows the client to request one resource but actually be served another without an HTTP redirect. Rewrites are invisible to the client.

There are simple rewrites (fast) and complex rewrites (slower), but they're powerful enough to accommodate most dynamic back-end applications.

### Syntax

<code class="block"><span class="hl-directive">rewrite</span> <span class="hl-arg"><i>from to</i></span></code>

*   **from** is the exact path to match
*   **to** is the destination path to rewrite to (the resource to respond with)

Advanced users may open a block and make a complex rewrite rule:

<code class="block"><span class="hl-directive">rewrite</span> <span class="hl-arg">[<i>basepath</i>]</span> {
    <span class="hl-subdirective">regexp</span> <i>pattern</i>
    <span class="hl-subdirective">ext</span>    <i>extensions...</i>
    <span class="hl-subdirective">if</span>     <i>a cond b</i>
    <span class="hl-subdirective">if_op</span>  <i>[</i>and|or<i>]</i>
    <span class="hl-subdirective">to</span>     <i>destinations...</i>
}</code>

*   **basepath** is the base path to match before rewriting with regular expression. Default is /.
*   **regexp** (shorthand: **r**) will match the path with the given regular expression **pattern**. <mark>Extremely high-load servers should avoid using regular expressions.</mark>
*   **extensions...** is a space-separated list of file extensions to include or ignore. Prefix an extension with `!` to exclude an extension. The forward slash `/` symbol matches paths without file extensions.
*   **if** specifies a rewrite condition. Multiple ifs are AND-ed together. **a** and **b** are any string and may use [request placeholders](/docs/placeholders). **cond** is the condition, with possible values explained below.
*   **if_op** specifies how the ifs are evaluated; the default is `and`.
*   **destinations...** is one or more space-separated paths to rewrite to, with support for [request placeholders](/docs/placeholders) as well as numbered regular expression captures such as {1}, {2}, etc. Rewrite will check each destination in order and rewrite to the first destination that exists. Each one is checked as a file or, if ends with /, as a directory. The last destination will act as default if no other destination exists.

### "if" conditions

The if keyword is a powerful way to describe your rule. It takes the format `a cond b`, where the values `a` and `b` are separated by `cond`, a condition. The condition can be any of these:

*   `is` = a equals b
*   `not` = a does NOT equal b
*   `has` = a has b as a substring (b is a substring of a)
*   `not_has` = b is NOT a substring of a
*   `starts_with` = b is a prefix of a
*   `ends_with` = b is a suffix of a
*   `match` = a matches b, where b is a regular expression
*   `not_match` = a does NOT match b, where b is a regular expression

### Examples

When requests come in for /mobile, actually serve /mobile/index.

<code class="block"><span class="hl-directive">rewrite</span> <span class="hl-arg">/mobile /mobile/index</span></code>

If the file is not favicon.ico and it is not a valid file or directory, serve the maintenance page if present, or finally, rewrite to index.php.

<code class="block"><span class="hl-directive">rewrite</span> {
    <span class="hl-subdirective">if</span> {file} not favicon.ico
    <span class="hl-subdirective">to</span> {path} {path}/ /maintenance.html /index.php
}</code>

If user agent includes "mobile" and path is not a valid file/directory, rewrite to the mobile index page.

<code class="block"><span class="hl-directive">rewrite</span> {
    <span class="hl-subdirective">if</span> {>User-agent} has mobile
    <span class="hl-subdirective">to</span> {path} {path}/ /mobile/index.php
}</code>

Rewrite /app to /index with a query string. `{1}` is the matched group `(.*)`.

<code class="block"><span class="hl-directive">rewrite</span> <span class="hl-arg">/app</span> {
    <span class="hl-subdirective">r</span>  (.*)
    <span class="hl-subdirective">to</span> /index?path={1}
}</code>
