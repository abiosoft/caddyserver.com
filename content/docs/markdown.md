---
title: markdown
type: docs
directive: true
---

markdown serves [Markdown](http://daringfireball.net/projects/markdown/) files as HTML pages on demand. You can specify whole custom templates or just the CSS and JavaScript files to be used on the pages to give them a custom look and behavior.

### Syntax

<code class="block"><span class="hl-directive">markdown</span> <span class="hl-arg">[<i>basepath</i>]</span> {
    <span class="hl-subdirective">ext</span>      <i>extensions...</i>
    <span class="hl-subdirective">[css|js]</span> <i>file</i>
    <span class="hl-subdirective">template</span> [<i>name</i>] <i>path</i>
}</code>

*   **basepath** is the base path to match. Markdown will not activate if the request URL is not prefixed with this path. Default is site root.
*   **extensions...** is a space-delimited list of file extensions to treat as Markdown (defaults to .md, .markdown, and .mdown); this is different from the [ext](/docs/ext) directive which assumes a missing file extension.
*   **css** indicates that the next argument is a CSS file to use on the page.
*   **js** indicates that the next argument is a JavaScript file to include on the page.
*   **file** is the JS or CSS file to add to the page.
*   **template** defines a template with the given **name** to be at the given **path**. To specify the default template, omit _name_. Markdown files can choose a template by using the name in its front matter.

You can use the js and css arguments more than once to add more files to the default template. If you want to accept defaults, you should completely omit the curly braces.

### Front Matter (Document Metadata)

Markdown files may begin with _front matter_, which is a specially-formatted block of metadata about the file. For example, it could describe the HTML template to use to render the file, or define the contents of the title tag. Front matter can be in YAML, TOML, or JSON formats.

[TOML](https://github.com/toml-lang/toml) front matter starts and ends with `+++`:

```toml
+++
template = "blog"
title = "Blog Homepage"
sitename = "A Caddy site"
+++
```

[YAML](http://yaml.org/) is surrounded by `---`:

```yaml
---
template: blog title: Blog Homepage
sitename: A Caddy site
---
```

[JSON](http://json.org) is simply `{` and `}`:

```json
{
	"template": "blog",
	"title": "Blog Homepage",
	"sitename": "A Caddy site"
}
```

### Markdown Templates

Template files are just HTML files with template tags, called actions, that can insert dynamic content depending on the file being served. The variables defined in metadata can be accessed from the templates like `{{.Doc.variable}}` where 'variable' is the name of the variable. The variable `.Doc.body` holds the body of the markdown file.

Here is a simple example template (contrived):

```html
<!DOCTYPE html>
<html>
	<head>
		<title>{{.Doc.title}}</title>
	</head>
	<body>
		Welcome to {{.Doc.sitename}}!
		<br><br>
		{{.Doc.body}}
	</body>
</html>
```

If you enable site generation, you can iterate the list of Markdown pages and link to them, for example:

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Document Index</title>
	</head>
	<body>
	{{range .Links}}
		<a href="{{.URL}}">{{.Title}}</a>
		<br>
		{{.Summary}}
		<hr>
	{{end}}
	</body>
</html>
```

Along with these template actions, all the standard [Caddy template actions](/docs/template-actions) are available to you in Markdown templates.

### Examples

Serve Markdown pages in /blog with no special formatting (assumes .md is the Markdown extension):

<code class="block"><span class="hl-directive">markdown</span> <span class="hl-arg">/blog</span></code>

Same as above, but with custom CSS and JS files:

<code class="block"><span class="hl-directive">markdown</span> <span class="hl-arg">/blog</span> {
	<span class="hl-subdirective">ext</span> .md .txt
	<span class="hl-subdirective">css</span> /css/blog.css
	<span class="hl-subdirective">js</span>  /js/blog.js
}</code>

With custom templates:

<code class="block"><span class="hl-directive">markdown</span> <span class="hl-arg">/blog</span> {
	<span class="hl-subdirective">template</span> default.html
	<span class="hl-subdirective">template</span> blog  blog.html
	<span class="hl-subdirective">template</span> about about.html
}</code>
