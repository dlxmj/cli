<!--
If your feature is significant enough that CLI users will want to know about it,
write a short summary sentence here. This is a draft document and will be
finalized when a new minor version is released.

Notes should look like this:

# App

* ***A cool thing.*** Rather than doing the annoying thing you used to do, you can
now do a different and much cooler thing.
* ***A faster thing.*** The `command` command was sped up by 3x in most cases.

# Theme

* ***Another cool thing.*** You get the idea by now.
-->

# App

* ***Function limit increased from 10 to 50 per app.***
* ***`--notify` flag on app dev.*** You can now specify `--notify` when running `app dev` to update a file or URL when files in your theme app extension are changed. This supports integrations with other tools.
* ***Default web type.*** Webs now default to `frontend` type, so it no longer needs to be specified. This is the recommended pattern for monolithic apps.
* ***`auth_callback_path` for monolithic apps.*** When working with a monolithing app with only a `frontend` web, you can now specify `auth_callback_path` in its `shopify.web.toml`.
* ***Support `.jpeg` files in theme app extensions.*** Previously only the `.jpg` extension was recognized.
* ***Install exact versions of dependencies.*** When adding dependencies to your app, the CLI ensures they are pinned to an exact version.
* ***Fix: Link to view checkout extensions.*** Always link to a published product for viewing checkout extensions. Unpublished products led to an error page.
* ***Fix: Clean up after failing to generate extensions.*** Previously if a failure occurred while generating an extension, a directory with invalid contents would remain. Now that directory will be deleted.
* ***Fix: Deploying function-only apps.*** Previously apps with only function extensions would fail to build and deploy; this is fixed.
* ***Fix: npm peerDependency resolution.*** When using npm as package manager, generating a react UI extension failed due to conflicts between installed copies of react. Dependency installation strategy is adapted to solve this.
* ***Fix: Obtaining a port when `HOST` is specified.*** When the `HOST` environment variable is specified, obtaining a random port failed; this is fixed.

# Theme

* ***--`notify` flag on theme dev.*** You can now specify `--notify` when running `theme dev` to update a file or URL when files are changed. This supports integrations with other tools.
* ***Upgrade theme-check to 1.15.0.*** Changelog [here](https://github.com/Shopify/theme-check/releases/tag/v1.15.0)
* ***`--update-docs` flag on theme check.*** You can now synchronously update Theme Check resources (objects, filters, and tags) before running it. This ensures that your code is checked against the most updated version of theme resources.
* ***Fix: Support vanity URLs on theme dev.*** Some elements, including images and fonts, were broken for vanity URLs. They are now displayed correctly.
* ***Fix: localhost link issue on theme dev.*** In some scenarios, the localhost link was being hidden.
* ***Fix: `/localization` and `/cart` requests on theme dev.*** Now, these endpoints will no longer fail when using `shopify theme dev`.

# UI (applicable across project types)

* ***No-color mode.*** You can use the `NO_COLOR=1` environment variable or `--no-color` flag to disable color in the CLI. Note that there is only partial support for some commands thus far.
* ***Specific error message in non-interactive terminals.*** If the CLI attempts to prompt in a non-interactive terminal (such as in CI), a clear error appears, making it obvious that a required flag is missing.
* ***Clean up after errors.*** When the CLI process encounters an error and quits, any hanging prompts or the taskbar will be cleared before exit, leaving only relevant logs.

# Auth (applicable across project types)
* ***Support for Google Cloud Shell.*** Add support for authentication in Google Cloud Shell.
