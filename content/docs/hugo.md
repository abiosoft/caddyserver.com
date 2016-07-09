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

### Syntax

<code class="block"><span class="hl-directive">hugo</span> <span class="hl-arg">[<i>dir</i>]</span> {
    <span class="hl-subdirective">styles</span> <i>file</i>
    <span class="hl-subdirective">flag1</span>   <i>value1</i>
    <span class="hl-subdirective">flag2</span>   <i>value2</i>
}</code>

* **dir** (optional) is the folder where the commands are going to be executed. By default, it is the current working directory. Default: `./`.
* **file** (optional) is the relative path to public folder of the admin UI styles. These styles won't replace the defaults, they will be added.
* **flags** are optional and they refer to the Hugo available flags. Please use their long form without `--` in the beginning. If no value is set, it will be evaluated as `true`.

This directive should be used with [root](/docs/root), [basicauth](/docs/basicauth) and [errors](/docs/errors) middleware to have the best experience. See the examples to know more.

### Examples

If you don't already have an Hugo website, don't worry. This plugin will auto-generate it for you. But that's not everything. I recommend you to take a look at Hugo [documentation](http://gohugo.io/themes/overview/) to learn more about themes, content types, and so on.

A simple Caddyfile to use with Hugo static website generator:

<code class="block"><span class="hl-directive">root</span>      <span class="hl-arg">public</span>           <span class="hl-comment"># the folder where Hugo generates the website</span>
<span class="hl-directive">basicauth</span> <span class="hl-arg">/admin user pass</span> <span class="hl-comment"># protect the admin area using HTTP basic auth</span>
<span class="hl-directive">hugo</span>                       <span class="hl-comment"># enable the admin panel</span></code>
