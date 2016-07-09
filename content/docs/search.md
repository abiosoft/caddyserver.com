---
title: search
type: docs
directive: true
plugin: true
link: https://github.com/pedronasser/caddy-search
---

search activates a site search engine that includes a search page and JSON API.

The search engine is powered by [bleve](http://blevesearch.com/). Only HTML, Markdown, and .txt files are indexed at this time.

<mark class="block">Note: This addon is still experimental. Please report bugs and submit your feedback to the maintainer.</mark>

### Syntax

<code class="block"><span class="hl-directive">search</span> <span class="hl-arg">[<i>directory</i>] <i>endpoint</i></span></code>

*   **directory** is a path within the site (can be a regular expression) that should be indexed. Default is site root.
*   **endpoint** is the path to the search endpoint. Default is /search.

For more control over the search engine, use the expanded form:

<code class="block"><span class="hl-directive">search</span> <span class="hl-arg">[<i>directory</i>]</span> {
	<span class="hl-subdirective">engine</span>        <i>engine</i>
	<span class="hl-subdirective">datadir</span>       <i>datadir</i>
	<span class="hl-subdirective">endpoint</span>      <i>endpoint</i>
	<span class="hl-subdirective">template</span>      <i>tpl</i>
	<span class="hl-subdirective">+path | -path</span> <i>path</i>
}</code>

*   **engine** is the indexing engine to use. Default is bleve.
*   **datadir** is the absolute path in which the index will be stored. Default is /tmp/caddyIndex.
*   **endpoint** is the path to the search endpoint. Default is /search.
*   **tpl** is the path to the HTML template used to render search results. Default is a simple, built-in template.
*   **path** is a path within the site to include (+path) or exclude (-path) from the index. Default is to include site root. You can repeat these properties to specify multiple paths.

### Search Template

You can access the search query with `{{.Query}}`. You can loop through the results and access properties of each like this:

```
{{range .Results}}
	<a href="{{.Path}}">{{.Title}}</a>
	{{.Body}}
	<br><br>
{{end}}
```

### JSON API

You can query the search endpoint with application/json in the Accept header. This allows you to write your own search interface or application. An example JSON output for a GET request to `/search?q=deploy+with+git` is:

```json
[
    {
        "Path": "/docs/git.html",
        "Title": "git - Caddy Directives",
        "Body": "<mark>git</mark> clones a <mark>git</mark> repository into the site. This makes it possible to <mark>deploy</mark> your site with a simple <mark>git</mark> push.\n\t\t\t\n\n\t\t\t\n\t\t\t\tThe <mark>git</mark> directive starts a service…",
        "Modified": "2015-09-27T16:08:43-06:00"
    },
    // ... 9 more results ...
]
```

### Examples

Index the whole site and expose a search endpoint at /search with the default HTML template:

<code class="block"><span class="hl-directive">search</span></code>

Index only the blog and documentation, but not the admin panel or robots.txt:

<code class="block"><span class="hl-directive">search</span> <span class="hl-arg">^/blog/</span> {
	<span class="hl-subdirective">+path</span> /static/docs
	<span class="hl-subdirective">-path</span> ^/blog/admin/
	<span class="hl-subdirective">-path</span> robots.txt
}</code>
