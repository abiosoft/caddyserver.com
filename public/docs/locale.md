---
title: locale
addonRepo: github.com/simia-tech/caddy-locale
---

locale detects the client's locale. It sets a header field named Detected-Locale with the value. It also creates a new [replacable value](/docs/placeholders) `{locale}` with the detected locale.

### Syntax

<code class="block"><span class="hl-directive">locale</span> <span class="hl-arg">[<i>locale\_list...</i>]</span> {
    <span class="hl-subdirective">detect</span>    <i>methods...</i>
	<span class="hl-subdirective">cookie</span>    <i>name</i>
	<span class="hl-subdirective">available</span> <i>locale\_list...</i>
	<span class="hl-subdirective">path</span>      <i>base\_path</i>
}</code>

- **locale\_list...** is the list of available locales. The first one will be used as default. Locales can be in the form "en" or "en-US".
- **methods...** is the list of ways to detect the locale. Allowed values are `cookie` (which reads the locale from a cookie) and `header` (which reads the Accept-Language header).
- **name** is the name of the cookie from which to read the locale.
- **base\_path** is the base path prefix to match, if you want locale detection to be scoped to certain paths only.


### Examples

Detect English or Deutsch using header:

<code class="block"><span class="hl-directive">locale</span> <span class="hl-arg">en de</span></code>

Same, but first try to detect locale using a cookie named "locale" or use the Accept-Language header as a fallback. The listed locales are checked in order until the first valid one is found. If both detection methods don't find any result, the default locale (first of the available locales) is chosen:

<code class="block"><span class="hl-directive">locale</span> <span class="hl-arg">en de</span> {
    <span class="hl-subdirective">detect</span> cookie header
    <span class="hl-subdirective">cookie</span> locale
}</code>

You should also set the Vary header when using locale detection:

<code class="block"><span class="hl-directive">header</span> <span class="hl-arg">/ Vary "Accept-Language, Cookie"</span></code>
