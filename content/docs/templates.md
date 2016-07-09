---
title: templates
type: docs
directive: true
---

templates allows you to add template actions to your pages. Templates can be a convenient way to render the current timestamp, request URL, visitor's IP address, and more. You also get basic control statements like `if` and `range`. See [Template Actions](/docs/template-actions) for instructions on how to use templates.

Some common uses of templates are to include the content of other files, show the current date or time, and hide or show certain parts of a page depending on the request path, cookies, or headers.

Note that [custom error pages](/docs/errors) do not get executed as templates, even if this directive is enabled. Error pages are served by a separate middleware.

### Syntax

<code class="block"><span class="hl-directive">templates</span> <span class="hl-arg">[<i>path</i> [<i>extensions...</i>]]</span></code>

*   **path** is the path to match before templates will be invoked
*   **extensions...** is a list of space-separated file extensions that will have templates

To specify certain extensions, a path must also be provided. The default path is / and the default extensions that will be executed as templates are .html, .htm, .tpl, .tmpl, and .txt.

### Template Format

See [Template Actions](/docs/template-actions).

### Example Template File

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Example Templated File</title>
	</head>
	<body>
		{{.Include "/includes/header.html"}}
		<p>
			Welcome {{.IP}}! You're visiting {{.URI}}.
		</p>
		{{.Include "/includes/footer.html"}}
	</body>
</html>
```

### Examples

Enable templates for all .html, .htm, .tpl, .tmpl, and .txt files:

<code class="block"><span class="hl-directive">templates</span></code>

Templates for the same file extensions but only under /portfolio:

<code class="block"><span class="hl-directive">templates</span> <span class="hl-arg">/portfolio</span></code>

Enable templates only on .html and .txt files in /portfolio:

<code class="block"><span class="hl-directive">templates</span> <span class="hl-arg">/portfolio .html .txt</span></code>
