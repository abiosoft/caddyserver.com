---
title: browse
type: docs
directive: true
---

browse enables directory browsing within the specified base path. It displays a file listing for directories which don't have an index file in them. In other server software, this is often called indexing.

By default, file listings are disabled and a request to a directory path (where no index file is present) will result in a 404 for obscurity reasons.

This middleware may set cookies to preserve UI preferences if the user changes them.

### Syntax

<code class="block"><span class="hl-directive">browse</span> <span class="hl-arg">[<i>path</i> [<i>tplfile</i>]]</span></code>

*   **path** is the base path to match. Any directories in this base path become browsable.
*   **tplfile** is the location of a template file to use.

A default template will be used if no template file is specified. Without any arguments, browsing is enabled on the entire site (path=/).

### Template Format

A template is simply an HTML file with _actions_ in it. The actions are parsed and executed to display dynamic content. This directive supports [Caddy's template actions](/docs/template-actions) as well as some additional actions specific to the browse directive. You may use template actions that render [this struct type](https://github.com/mholt/caddy/blob/060ab92d295ba9dd8e34115c92557d5eff5896ff/middleware/browse/browse.go#L41-L118) (notice that some helper methods are available).

Here is a very simple example template:

```html
---
title: 
type: docs
directive: true
plugin: true
link: https://github.com/abiosoft/caddy-git
---
<html>
	<head>
		<title>{{.Name}}</title>
	</head>
	<body>
		{{if .CanGoUp}}<a href="..">Up one level</a><br>{{end}}
		<h1>{{.Path}}</h1>
		{{range .Items}}
		<a href="{{.URL}}">{{.Name}}</a><br>
		{{end}}
	</body>
</html>
```

... but the default template is nicer.

### JSON Response

You can ask for a JSON representation instead of a browse page by having **application/json** in your **Accept** header:

```
$ curl -H "Accept: application/json" 'localhost:2015/?limit=1'
[{"IsDir":true,"Name":".git","Size":476,"URL":".git/","ModTime":"2015-09-11T03:20:09+03:00","Mode":2147484141}]
```

The above example demonstrates how to ask for JSON, as well as how to limit the number of entries that we want via a query called **limit**. To yield the whole listing, omit the limit query.

### Examples

Allow directory listings in all folders that don't have an index file:

<code class="block"><span class="hl-directive">browse</span></code>

Show photo album contents (in /photos) via a custom template:

<code class="block"><span class="hl-directive">browse</span> <span class="hl-arg">/photos ../photo_album.tpl</span></code>
