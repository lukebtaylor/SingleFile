#!/bin/bash
set -euo pipefail

# Idiomatic local dev workflow for the SingleFile browser extension.
#
# Builds/refreshes a dev/ directory that can be loaded directly as an
# unpacked (Chrome/Edge) or temporary (Firefox) extension, without touching
# lib/ - the folder build-extension.sh's release build writes to. Re-run
# this script any time you want dev/ to reflect your current source: it
# always rebuilds dev/lib from scratch and (re)creates the
# manifest.json/_locales/src links if they're missing or point somewhere
# unexpected.
#
# Usage:
#   npm run dev         (or: scripts/install-dev.sh)          one-shot build
#   npm run dev:watch    (or: scripts/install-dev.sh --watch)  build, then
#                        keep rebuilding dev/lib on every source change
#   npm run dev:run      (or: scripts/install-dev.sh --run)    build, launch
#                        Firefox with dev/ loaded as a temporary extension
#                        (via web-ext), and live-reload it on every change -
#                        this is the closest thing to "an install script
#                        that overwrites the existing plugin when run",
#                        just automatic. Targets Firefox because this repo
#                        is manifest_version 2; see the README for why
#                        Chrome/Edge use a separate MV3 build.
#
# --run uses `npx web-ext`, not a pinned devDependency - npx fetches it on
# demand the first time you use --run. `npm install --save-dev web-ext` if
# you'd rather have it pinned in package.json/package-lock.json.

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

if [ ! -d node_modules ]; then
	echo "Installing dependencies..."
	npm install
fi

mkdir -p dev

# Links manifest.json/_locales/src into dev/ so the browser can load dev/
# as a complete, self-contained extension root. These are linked rather
# than copied so edits to files the browser reads directly (background.html,
# options.html, *.css, etc. - anything manifest.json references outside of
# lib/) take effect immediately with no rebuild step.
link() {
	local name="$1"
	local target="$repo_root/$name"
	local link_path="$repo_root/dev/$name"
	if [ -L "$link_path" ] && [ "$(readlink "$link_path")" = "$target" ]; then
		return
	fi
	rm -rf "$link_path"
	if ln -s "$target" "$link_path" 2>/dev/null; then
		echo "Linked dev/$name -> $name"
	else
		# Symlinks need Developer Mode (or admin rights) on Windows - fall
		# back to a plain copy so this still works without either. You'll
		# need to re-run this script after editing manifest.json/_locales/
		# src for the copy to pick up your changes in that case.
		echo "Symlinks unavailable, copying $name -> dev/$name instead"
		rm -rf "$link_path"
		cp -r "$target" "$link_path"
	fi
}

link manifest.json
link _locales
link src

mode="${1:-}"

case "$mode" in
"")
	echo "Building dev/lib..."
	npx rollup -c rollup.config.dev.js
	cat <<'EOF'

Done. Load dev/manifest.json as an unpacked/temporary extension:
  Firefox: about:debugging#/runtime/this-firefox -> Load Temporary Add-on
  Chrome/Edge: chrome://extensions -> enable Developer mode -> Load unpacked
    (this repo targets manifest_version 2; recent Chrome/Edge releases
    restrict or reject MV2 unpacked installs - see the README's Install
    section, and github.com/gildas-lormeau/SingleFile-MV3 for the MV3 build
    Chrome/Edge actually ship)

Re-run this script any time to rebuild, or use --watch / --run instead.
EOF
	;;
--watch)
	echo "Building dev/lib and watching for changes..."
	npx rollup -c rollup.config.dev.js --watch
	;;
--run)
	echo "Building dev/lib and starting a live-reloading Firefox session..."
	npx rollup -c rollup.config.dev.js
	npx rollup -c rollup.config.dev.js --watch &
	rollup_pid=$!
	trap 'kill "$rollup_pid" 2>/dev/null || true' EXIT
	npx web-ext run --source-dir=dev
	;;
*)
	echo "Usage: $0 [--watch|--run]" >&2
	exit 1
	;;
esac
