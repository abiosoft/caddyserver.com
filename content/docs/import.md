---
title: import
type: docs
directive: true
---

import allows you to use configuration from another file. It gets replaced with the contents of that file.

This is a unique directive in that `import` can appear outside of a server block. In other words, it can appear at the top of a Caddyfile where an address would normally be. Like other directives, however, it cannot be used inside of other directives.

Note that the the import path is relative to the Caddyfile, not the current working directory.

### Syntax

<code class="block"><span class="hl-directive">import</span> <span class="hl-arg"><i>pattern</i></span></code>

*   **pattern** is the file or glob pattern (`*`) to include. Its contents will replace this line, as if that file's contents appeared here to begin with. This value is relative to the Caddyfile's location.

### Examples

Import a shared configuration:

<code class="block"><span class="hl-directive">import</span> <span class="hl-arg">config/common.conf</span></code>

Imports any files found in the vhosts folder:

<code class="block"><span class="hl-directive">import</span> <span class="hl-arg">../vhosts/*</span></code>
