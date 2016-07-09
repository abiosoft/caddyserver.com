---
title: git
type: docs
directive: true
plugin: true
link: https://github.com/abiosoft/caddy-git
---

git clones a [git](http://git-scm.com/) repository into the site. This makes it possible to deploy your site with a simple `git push`.

The git directive starts a service routine that runs during the lifetime of the server. When the service starts, it clones the repository. While the server is still up, it pulls the latest every so often. You can also set up a webhook to pull immediately after a push. In regular git fashion, a pull only includes changes, so it is very efficient.

If a pull fails, the service will retry up to three times. If the pull was not successful by then, it won't try again until the next interval.

**Requirements:** This directive requires git to be installed. Also, private repositories may only be accessed from Linux or Mac systems. (Contributions are welcome that make private repositories work on Windows.)

### Syntax

<code class="block"><span class="hl-directive">git</span> <span class="hl-arg"><i>repo</i> [<i>clonepath</i>]</span></code>

*   **repo** is the URL to the repository; SSH and HTTPS URLs are supported
*   **clonepath** is the path, relative to site root, to clone the repository into; default is site root

This simplified syntax pulls from master every 3600 seconds (1 hour) and only works for public repositories.

For more control or to use a private repository, use the following syntax:

<code class="block"><span class="hl-directive">git</span> <span class="hl-arg"><i>repo</i> [<i>clonepath</i>]</span> {
	<span class="hl-subdirective">repo</span>     <i>repo</i>
	<span class="hl-subdirective">path</span>     <i>clonepath</i>
	<span class="hl-subdirective">branch</span>   <i>branch</i>
	<span class="hl-subdirective">key</span>      <i>key</i>
	<span class="hl-subdirective">hook</span>     <i>path</i> [<i>secret</i>]
	<span class="hl-subdirective">interval</span> <i>interval</i>
	<span class="hl-subdirective">then</span>     <i>command</i> [<i>args...</i>]
	<span class="hl-subdirective">then_long</span><i>command</i> [<i>args...</i>]
}</code>

*   **repo** is the URL to the repository; SSH and HTTPS URLs are supported.
*   **clonepath** is the path, relative to site root, to clone the repository into; default is site root.
*   **branch** is the branch or tag to pull; default is master branch. Can be {latest} for most recent tag.
*   **key** is the path to the SSH private key; only required for private repositories.
*   **path** and **secret** are used to create a webhook which pulls the latest right after a push. This supports GitHub, GitLab, BitBucket and a [generic format](#payloadsample) for others. **secret** is currently supported for GitHub hooks only.
*   **interval** is the number of seconds between pulls; default is 3600 (1 hour), minimum 5.
*   **command** is a command to execute after successful pull; followed by **args** which are any arguments to pass to the command. If multiple "then" lines are used, they will be executed in order.
*   **then_long** is for long-running commands that should run in the background.

Each property in the block is optional. The path and repo may be specified on the first line, as in the first syntax, or
they may be specified in the block with other values.

### Examples

Public repository pulled into site root every hour:

<code class="block"><span class="hl-directive">git</span> <span class="hl-arg">github.com/user/myproject</span></code>

Public repository pulled into the "subfolder" directory in the site root:

<code class="block"><span class="hl-directive">git</span> <span class="hl-arg">github.com/user/myproject /subfolder</span></code>

Private repository pulled into the "subfolder" directory with tag v1.0 once per day:

<code class="block"><span class="hl-directive">git</span> {
	<span class="hl-subdirective">repo</span>     git@github.com:user/myproject
	<span class="hl-subdirective">branch</span>   v1.0
	<span class="hl-subdirective">key</span>      /home/user/.ssh/id_rsa
	<span class="hl-subdirective">path</span>     subfolder
	<span class="hl-subdirective">interval</span> 86400
}</code>

Generate a static site with [Hugo](http://gohugo.io) after each pull:

<code class="block"><span class="hl-directive">git</span> <span class="hl-arg">github.com/user/site</span> {
	<span class="hl-subdirective">path</span>  ../
	<span class="hl-subdirective">then</span>  hugo --destination=/home/user/hugosite/public
}</code>

Part of a Caddyfile for a PHP site that gets changes from a private repo:

<code class="block"><span class="hl-directive">git</span> <span class="hl-arg">git@github.com:user/myphpsite</span> {
	<span class="hl-subdirective">key</span> /home/user/.ssh/id_rsa
}
<span class="hl-directive">fastcgi</span> <span class="hl-arg">/ 127.0.0.1:9000 php</span></code>

Specifying a webhook:

<code class="block"><span class="hl-directive">git</span> <span class="hl-arg">git@github.com:user/site</span> {
	<span class="hl-subdirective">hook</span> /webhook secret-password
}</code>

Generic webhook payload:

<code class="block">{
	<span class="hl-subdirective">"ref" : "refs/heads/branch"</span>
}</code>
