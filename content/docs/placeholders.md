---
title: placeholders
type: docs
---

Some directives allow you to use placeholders in your Caddyfile to fill out a value differently for every request. For example, the value `{path}` would be replaced by the path portion of the request URL. These are also called replaceable values.

<mark class="block">These placeholders only work on directives that support them. Check the documentation for your directive to see if placeholders are supported.</mark>

### Request Placeholders

These values are obtained from the request.

*   **{dir}** - The directory of the requested file (from request URI)
*   **{file}** - The name of the requested file (from request URI)
*   **{fragment}** - The last part of the URL starting with "#"
*   **{>Header}** - Any request header, where "Header" is the header field name
*   **{host}** - The host value on the request
*   **{hostname}** - The name of the host machine that is processing the request
*   **{hostonly}** - Same as {host} but without port information
*   **{method}** - The request method (GET, POST, etc.)
*   **{path}** - The path portion of the URL (does not include query string or fragment)
*   **{path_escaped}** - Query-escaped variant of {path}
*   **{port}** - The client's port
*   **{proto}** - The protocol string (e.g. "HTTP/1.1")
*   **{query}** - The query string portion of the URL, without leading "?"
*   **{query_escaped}** - The query-escaped variant of {query}
*   **{remote}** - The client's IP address
*   **{request}** - The entire HTTP request (sans body), compacted to one line
*   **{scheme}** - The protocol/scheme used (usually http or https)
*   **{uri}** - The request URI (includes path, query string, and fragment)
*   **{uri_escaped}** - The query-escaped variant of {uri}
*   **{when}** - Timestamp in the format `02/Jan/2006:15:04:05 -0700`

### Response Placeholders

These values are obtained from the response, and are only implemented with some directives. Make sure your directive supports response placeholders before attempting to use them.

*   **{latency}** - Approximate time the server spent handling the request
*   **{size}** - The size of the response body
*   **{status}** - The HTTP status code of the response
