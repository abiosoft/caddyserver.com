---
title: Template Actions
type: docs
---


Caddy's template features make it possible to add some dynamic content to your static website and include pages to help reduce duplication. Templates are supported by a few different directives such as [templates](/docs/templates), [browse](/docs/browse), and [markdown](/docs/markdown).

<mark class="block">Template actions only work on directives that support them. Check the documentation for your directive to see if and how they can be used.</mark>

Caddy templates use the syntax defined in Go's [text/template](http://golang.org/pkg/text/template/) package. Understanding text/template will help you take full advantage of templates, but for those of us who aren't programmers, here are some simplified instructions. Caddy also adds some extra helpful functions for templating web pages specifically, which we've documented here.

### Basic Syntax

Template actions are enclosed between `{{` and `}}` markers. Template words are case-sensitive.

### Common Functions

**Include another file:**

```html
{{.Include "path/to/file.html"}}
```

**Include and render a Markdown file:** (not needed in [markdown](/docs/markdown) middleware)

```html
{{.Markdown "path/to/file.md"}}
```

**Show current timestamp:** ([format](https://github.com/golang/go/blob/f06795d9b742cf3292a0f254646c23603fc6419b/src/time/format.go#L9-L41))

```html
{{.Now "Monday, 2 Jan 2006"}}
```

**Cookie value:**

```html
{{.Cookie "name"}}
```

**Header field value:**

```html
{{.Header "name"}}
```

**Visitor's IP:**

```html
{{.IP}}
```

**Request URI:**

```html
{{.URI}}
```

**Host portion of request:**

```html
{{.Host}}
```

**Port portion of request:**

```html
{{.Port}}
```

**Request method:**

```html
{{.Method}}
```

**Whether request path matches another path:**

```html
{{.PathMatches "/some/path"}}
```

**A part of the URL:**

```html
{{.URL.RawQuery}}
```

RawQuery returns the query string. You can replace RawQuery with Host, Scheme, Fragment, String, or Query.Get "parameter".

**Environment variables:**

You can access environment variables directly because `Env` is a map.
```html
{{.Env.ENV_VAR_NAME}}
```
For example the follow will output the `PATH` environment variable.
```html
{{.Env.PATH}}
```
You can use the following example to output all your environment variables.
__For debugging purposes only. This is not recommended for production.__
```html
<table>{{range $name, $value := .Env}}
	<tr><td>{{$name}}</td><td>{{$value}}</td></tr>
{{end}}</table>
```

**Truncate value to certain length:** (from beginning, or from end)

```html
{{.Truncate "value" 3}}  // "val"
```
```html
{{.Truncate "value" -3}} // "lue"
```

**String replacement:**

```html
{{.Replace "haystack" "needle" "replacement"}}
```

**Current date/time object:** (useful in date-related functions)

```html
{{.NowDate}}
```

**Get extension from file path:**

```html
{{.Ext "path/filename.ext"}}
```

**Strip extension from file path:**

```html
{{.StripExt "filename.ext"}}
```

**Strip HTML, leaving only the plain text:**

```html
{{.StripHTML "Shows <b>only</b> text content"}}
```

**Lower-case a string:**

```html
{{.ToLower "Makes Me ONLY lowercase"}}
```

**Upper-case a string:**

```html
{{.ToUpper "Makes me only UPPERCASE"}}
```

**Split a string by separator:**

```html
{{.Split "123-456-7890" "-"}}
```

**Convert list of values to a slice (array):**

```html
{{.Slice "a" "b" "c"}}
```

**Map keys to values:** (useful in advanced cases, with subtemplates, etc.)

```html
{{.Map "key1" "value1" "key2" "value2"}}
```

### Built-in Sanitization Functions

These functions are built into text/template but you may find them helpful.

**Make HTML-safe (escape special characters):**

```html
{{html "Makes it <i>safe</i> to render as HTML"}}
```

**Make JavaScript-safe:**

```html
{{js "Makes content safe for use in JS"}}
```

**URL-escape (query-encode):**

```html
{{urlquery "Makes safe for URL query strings"}}
```

### Control Statements

**If:**

```html
{{if .PathMatches "/secret/sauce"}}
	Only for secret sauce pages
{{end}}
```

**If-else:**

```html
{{if .PathMatches "/secret/sauce"}}
	Only for secret sauce pages
{{else}}
	No secret sauce for you
{{end}}
```

**If-elseif-else:**

```html
{{if .PathMatches "/secret/sauce"}}
	Only for secret sauce pages
{{else if eq .URL "/banana.html"}}
	You're on the banana page
{{else}}
	No bananas or secret sauce
{{end}}
```

**Range:** (iterate data; this example dumps request headers)

```html
{{range $field, $val := .Req.Header}}
    {{$field}}: {{$val}}
{{end}}
```


**Server-side comments:**

```html
{{/* This isn't sent to the client */}}
```

### Comparison Functions

Useful in "if" statements, you can use comparison functions:

*   `eq` Equal
*   `ne` Not equal
*   `lt` Less than
*   `le` Less than or equal
*   `gt` Greater than
*   `ge` Greater than or equal

Or these logic functions:

*   `not` Reverses the if condition
*   `or` Returns first non-empty argument or the last argument
*   `and` Returns first empty argument or the last argument

### Further Reading

These are just a few examples of what you can do. If you need even more template power, read the description of the [text/template](http://golang.org/pkg/text/template/) package which goes into much more detail.
