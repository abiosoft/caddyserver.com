---
title: filemanager
type: docs
directive: true
plugin: true
link: https://github.com/hacdias/caddy-filemanager
---

filemanager is an extension based on browse middleware. It provides a file managing interface within the specified directory and it can be used to upload, delete, preview and rename your files within that directory.

![File Manager for Caddy](/resources/images/middleware/filemanager.png)

It is extremely important for security reasons to cover the path of filemanager with some kind of authentication. You can use, for example, [`basicauth`](/docs/basicauth) directive.

### Syntax

<code class="block"><span class="hl-directive">filemanager</span> <span class="hl-arg"><i>[baseurl]</i></span> {
	<span class="hl-subdirective">show</span> 	        <i>directory</i>
	<span class="hl-subdirective">styles</span> 	    <i>filepath</i>
    <span class="hl-subdirective">allow_new</span>      <i>[true|false]</i>
    <span class="hl-subdirective">allow_edit</span>     <i>[true|false]</i>
    <span class="hl-subdirective">allow_commands</span> <i>[true|false]</i>
    <span class="hl-subdirective">allow_command</span>  <i>command</i>
    <span class="hl-subdirective">block_command</span>  <i>command</i>
    <span class="hl-subdirective">allow</span>          <i>[url|dotfiles]</i>
    <span class="hl-subdirective">allow_r</span>        <i>regex</i>
    <span class="hl-subdirective">block</span>          <i>[url|dotfiles]</i>
    <span class="hl-subdirective">block_r</span>        <i>regex</i>
}</code>

All of the options above are optional.

+	**baseurl** is the URL where you will access the File Manager interface. By default it is `/`.
+	**directory** is the path to the directory you want to browse in. It can be either relative or absolute. By default it is `./`.
+	**filepath** is the relative or absolute path to the stylesheet file. This file doesn't need to be accessible from the web.
+	**allow_new**, **allow_edit** and **alow_commands** are used to set the permissions to create new files/directories, edit/rename/delete files or directories and execute commands, respectively. By default they are all `true`.
+	**command** is a command line command. They can be used in the command bar in the admin interface and by default `git`, `svn` and `hg` are enabled. You can block or allow more here.
+	**allow** and **block** can be used to allow or deny the access to specific files or directories using their URL. You can use the magic word `dotfiles` to allow or block the access to dot-files. The blocked files won't show in the admin interface. By default, `block dotfiles` is activated.
+	**allow_r** and **block_r** and variations of the previous options but you are able to use regular expressions with them. These regular expressions are used to match the URL, **not** the internal file path.

So, by **default** we have:

<code class="block"><span class="hl-directive">filemanager</span> <span class="hl-arg">/</span> {
	<span class="hl-subdirective">show</span> 	        <i>./</i>
    <span class="hl-subdirective">allow_new</span>      <i>true</i>
    <span class="hl-subdirective">allow_edit</span>     <i>true</i>
    <span class="hl-subdirective">allow_commands</span> <i>true</i>
    <span class="hl-subdirective">allow_command</span>  <i>git</i>
	<span class="hl-subdirective">allow_command</span>  <i>svn</i>
	<span class="hl-subdirective">allow_command</span>  <i>hg</i>
    <span class="hl-subdirective">block</span>          <i>dotfiles</i>
}</code>

As already mentioned, this extension should be used with [`basicauth`](/docs/basicauth). If you do that, you will also be able to set permissions for different users using the following syntax:

<code class="block"><span class="hl-directive">filemanager</span></span> {
	<span class="hl-comment"># You set the global configurations here and</span>
	<span class="hl-comment"># all the users will inherit them.</span>
	<span class="hl-subdirective">user1:</span>
	<span class="hl-comment"># Here you can set specific settings for the 'user1'.</span>
	<span class="hl-comment"># They will override the global ones for this specific user.</span>
}</code>

### Examples

Show the directory where Caddy is being executed at the root of the domain:

<code class="block"><span class="hl-directive">filemanager</span></code>

Show the content of `foo` at the root of the domain:

<code class="block"><span class="hl-directive">filemanager</span> {
	<span class="hl-subdirective">show</span> <i>foo/</i>
}</code>

Show the directory where Caddy is being executed at `/filemanager`:

<code class="block"><span class="hl-directive">filemanager</span> <span class="hl-arg">/filemanager</span></code>

Show the content of `foo` at `/bar`:

<code class="block"><span class="hl-directive">filemanager</span> <span class="hl-arg">/bar</span>{
	<span class="hl-subdirective">show</span> 	<i>foo/</i>
}</code>

Now, a bit more complicated example. You have three users: an administrator, a manager and an editor. The administrator can do everything and has access to the commands `rm` and `mv` because he is a geeky. The manager, doesn't have access to commands, but can create and edit files. The editor can **only** edit files. He can't even create new ones, because he will only edit the files after the manager creates them for him. Both the editor and the manager won't have access to the financial folder. We would have:

<code class="block"><span class="hl-directive">basicauth</span> <span class="hl-arg">/admin admin pass</span>
<span class="hl-directive">basicauth</span> <span class="hl-arg">/admin manager pass</span>
<span class="hl-directive">basicauth</span> <span class="hl-arg">/admin editor pass</span>
<span class="hl-directive"></span>
<span class="hl-directive">filemanager</span> <span class="hl-arg">/admin</span> {
	<span class="hl-subdirective">show</span> 	        <i>./</i>
	<span class="hl-subdirective">allow_commands</span> <i>false</i>
	<span class="hl-subdirective">admin:</span>
	<span class="hl-subdirective">allow_commands</span> <i>true</i>
	<span class="hl-subdirective">allow_command</span>  <i>rm</i>
	<span class="hl-subdirective">allow_command</span>  <i>mv</i>
	<span class="hl-subdirective">allow</span>  		<i>dotfiles</i>
	<span class="hl-subdirective">manager:</span>
	<span class="hl-subdirective">block</span>  		<i>/admin/financial</i>
	<span class="hl-subdirective">editor:</span>
	<span class="hl-subdirective">allow_new</span>      <i>false</i>
	<span class="hl-subdirective">block</span>  		<i>/admin/financial</i>
}</code>
