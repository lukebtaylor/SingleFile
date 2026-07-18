import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

// Upstream's version of this file resolved `single-file-core` via
// `moduleDirectories: [".."]`, which walks up from each importing file
// looking for a sibling directory literally named `single-file-core` next
// to this checkout - i.e. it assumes you've also cloned
// https://github.com/gildas-lormeau/single-file-core as a sibling folder
// and are actively editing it too. That's a real, useful workflow if you're
// co-developing single-file-core, but it means `npm run dev` fails outright
// for anyone who hasn't done that extra clone.
//
// Dropping the option (falling back to the default `["node_modules"]`)
// makes `npm install && npm run dev` work standalone, resolving
// single-file-core from the published package the same way the production
// rollup.config.js already does. If you *are* co-developing single-file-core
// locally, either restore `moduleDirectories: [".."]` here, or `npm link`
// your local single-file-core checkout into node_modules instead.
const PLUGINS = [resolve()];
const EXTERNAL = ["single-file-core"];

// Output goes to dev/lib instead of lib so a dev build never overwrites the
// lib/ produced by build-extension.sh (the release build). See
// scripts/install-dev.sh, which builds this config into a self-contained
// dev/ folder you can load as an unpacked/temporary extension.
export default [{
	input: ["single-file-core/single-file.js"],
	output: [{
		file: "dev/lib/single-file.js",
		format: "umd",
		name: "singlefile",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-frames.js"],
	output: [{
		file: "dev/lib/single-file-frames.js",
		format: "umd",
		name: "singlefile",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-bootstrap.js"],
	output: [{
		file: "dev/lib/single-file-bootstrap.js",
		format: "umd",
		name: "singlefileBootstrap",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-hooks-frames.js"],
	output: [{
		file: "dev/lib/single-file-hooks-frames.js",
		format: "iife",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-infobar.js"],
	output: [{
		file: "dev/lib/single-file-infobar.js",
		format: "iife",
		plugins: [terser()]
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/vendor/zip/z-worker.js"],
	output: [{
		file: "dev/lib/single-file-z-worker.js",
		format: "es",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/vendor/zip/zip.js"],
	output: [{
		file: "dev/lib/single-file-zip.js",
		format: "es",
		plugins: []
	}],
	context: "this",
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/vendor/zip/zip.min.js"],
	output: [{
		file: "dev/lib/single-file-zip.min.js",
		format: "es",
		plugins: []
	}],
	context: "this",
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["src/core/content/content-bootstrap.js"],
	output: [{
		file: "dev/lib/single-file-extension-bootstrap.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/core/content/content-frames.js"],
	output: [{
		file: "dev/lib/single-file-extension-frames.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/index.js"],
	output: [{
		file: "dev/lib/single-file-extension-core.js",
		format: "umd",
		name: "extension",
		plugins: []
	}]
}, {
	input: ["src/core/content/content.js"],
	output: [{
		file: "dev/lib/single-file-extension.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/ui/content/content-ui-editor-web.js"],
	output: [{
		file: "dev/lib/single-file-extension-editor.js",
		format: "iife",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["single-file-core/single-file-editor-helper.js"],
	output: [{
		file: "dev/lib/single-file-extension-editor-helper.js",
		format: "umd",
		name: "singlefile",
		plugins: []
	}],
	plugins: PLUGINS,
	external: EXTERNAL
}, {
	input: ["src/lib/single-file/browser-polyfill/chrome-browser-polyfill.js"],
	output: [{
		file: "dev/lib/chrome-browser-polyfill.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/core/bg/index.js"],
	output: [{
		file: "dev/lib/single-file-extension-background.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/lib/single-file/background.js"],
	output: [{
		file: "dev/lib/single-file-background.js",
		format: "iife",
		plugins: []
	}]
}, {
	input: ["src/lib/web-stream/index.js"],
	output: [{
		file: "dev/lib/web-stream.js",
		format: "iife",
		plugins: []
	}]
}];
