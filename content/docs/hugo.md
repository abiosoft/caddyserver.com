---
title: hugo
type: docs
directive: true
plugin: true
link: https://github.com/hacdias/caddy-hugo
---

hugo fills the gap between Hugo and the browser. [Hugo](http://gohugo.io/) is an easy and fast static website generator. This plugin fills the gap between Hugo and the end-user, providing you an web interface to manage the whole website.

![Screenshot](/resources/images/middleware/hugo.png)

Using this plugin, you won't need to have your own computer to edit posts, neither regenerate your static website, because you can do all of that just through your browser.

**Requirements:** you need to have the hugo executable in your PATH. You can download it from its [official page](http://gohugo.io).

### Syntax

<code class="block"><span class="hl-directive">hugo</span> <span class="hl-arg">[<i>directory</i>] [<i>admin</i>]</span> {
    <span class="hl-subdirective">flag</span> <i>name</i> <i>[value]</i>
    <span calss="hl-comment"># other file manager compatible options</span>
}</code>

All of the options above are optional.

* **directory** is the folder where the commands are going to be executed. By default, it is the current working directory. Default: `./`.
* **admin** is the path where you will find your administration interface. Default: `/admin`.
* **name** refers to the Hugo available flags. Please use their long form without `--` in the beginning. If no **value** is set, it will be evaluated as `true`.

In spite of these options, you can also use the [filemanager](/docs/filemanager) so you can have more control about what can be acceded, the permissions of each user, and so on.

This directive should be used with [root](/docs/root), [basicauth](/docs/basicauth) and [errors](/docs/errors) middleware to have the best experience. See the examples to know more.

### Examples

If you don't already have an Hugo website, don't worry. This plugin will auto-generate it for you. But that's not everything. It is recommended that you take a look at Hugo [documentation](http://gohugo.io/themes/overview/) to learn more about themes, content types, and so on.

A simple Caddyfile to use with Hugo static website generator:

<code class="block"><span class="hl-directive">root</span>      <span class="hl-arg">public</span>           <span class="hl-comment"># the folder where Hugo generates the website</span>
<span class="hl-directive">basicauth</span> <span class="hl-arg">/admin user pass</span> <span class="hl-comment"># protect the admin area using HTTP basic auth</span>
<span class="hl-directive">hugo</span>                       <span class="hl-comment"># enable the admin panel</span></code>
