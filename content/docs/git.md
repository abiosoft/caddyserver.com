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
	<span class="hl-subdirective">repo</span>     	<i>repo</i>
	<span class="hl-subdirective">path</span>     	<i>clonepath</i>
	<span class="hl-subdirective">branch</span>   	<i>branch</i>
	<span class="hl-subdirective">key</span>      	<i>key</i>
	<span class="hl-subdirective">hook</span>     	<i>path</i> [<i>secret</i>]
	<span class="hl-subdirective">hook_type</span>	<i>type</i>
	<span class="hl-subdirective">interval</span> 	<i>interval</i>
	<span class="hl-subdirective">args</span> 		<i>args</i>
	<span class="hl-subdirective">then</span>     	<i>command</i> [<i>args...</i>]
	<span class="hl-subdirective">then_long</span>	<i>command</i> [<i>args...</i>]
	<span class="hl-subdirective">use_absolute_path</span>
}</code>

*   **repo** is the URL to the repository; SSH and HTTPS URLs are supported.
*   **clonepath** is the path, relative to site root, to clone the repository into; default is site root.
*   **branch** is the branch or tag to pull; default is master branch. Can be **`{latest}`** for most recent tag.
*   **key** is the path to the SSH private key; only required for private repositories.
*   **path** and **secret** are used to create a webhook which pulls the latest right after a push. This is limited to the [supported webhooks](#supported-webhooks). **secret** is currently supported for GitHub and Travis hooks only.
*	**type** is webhook type to use. The webhook type is auto detected by default but it can be explicitly set to one of the [supported webhooks](#supported-webhooks). This is a requirement for [generic webhook](#generic_format).
*   **interval** is the number of seconds between pulls; default is 3600 (1 hour), minimum 5. An interval of -1 (or specifying webhook) disables periodic pull.
*	**args** is the additional cli args to pass to `git clone` e.g. `--depth=1`. 
*   **command** is a command to execute after successful pull; followed by **args** which are any arguments to pass to the command. You can have multiple lines of this for multiple commands. **then_long** is for long executing commands that should run in background.
*	**use\_absolute\_path** configures **clonepath** to be handled as an absolute path; instead of relative.

Each property in the block is optional. The path and repo may be specified on the first line, as in the first syntax, or
they may be specified in the block with other values.

<a name="supported-webhooks"></a>
### Supported Webhooks
* [github](https://github.com)
* [gitlab](https://gitlab.com)
* [bitbucket](https://bitbucket.org)
* [travis](https://travis-ci.org)
* [gogs](https://gogs.io)
* [generic](#generic_format)

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

<a name="generic_format"></a>
Generic webhook payload:

<code class="block">{
	<span class="hl-subdirective">"ref" : "refs/heads/branch"</span>
}</code>
