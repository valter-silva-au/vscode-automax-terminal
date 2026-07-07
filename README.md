# AutoMax Terminal

A tiny VS Code extension that **automatically maximizes the panel (terminal, problems, output, etc.) when no editors are open**, and **restores it as soon as you open a file**.

Handy if you like to work in a maximized terminal but want the editor to take over the moment you open a file — without reaching for a keyboard shortcut every time.

## How it works

VS Code fires an event whenever the set of open editor tabs changes. This extension counts the open tabs across all tab groups:

- **0 tabs open** → maximize the panel (`workbench.action.toggleMaximizedPanel`)
- **≥1 tab open** → restore the panel

It re-checks on tab changes, active-editor changes, and on startup.

## Requirements

- VS Code `1.67.0` or newer (uses the stable `window.tabGroups` API).

## Install

This extension isn't published to the Marketplace — install it from a packaged `.vsix`.

```bash
# from the extension folder
npm install                       # pulls in @vscode/vsce (packaging only)
npx @vscode/vsce package          # produces automax-terminal-<version>.vsix
code --install-extension automax-terminal-0.1.0.vsix --force
```

Then **reload VS Code** (Command Palette → **Developer: Reload Window**, or restart it) — the extension activates on startup, so it needs a fresh window.

Verify it's installed:

```bash
code --list-extensions --show-versions | grep automax
# valter-silva-au.automax-terminal@0.1.0
```

> **Note:** installing from a local `.vsix` means the extension **won't auto-update**. See [Updating](#updating).

## Usage

Once installed and reloaded, it just works:

- Close all editor tabs → the panel maximizes.
- Open any file → the panel restores.

Disable it anytime via the `automaxTerminal.enabled` setting (Settings → search "AutoMax").

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `automaxTerminal.enabled` | `true` | Automatically maximize the panel when no editors are open, and restore it when a file is opened. |

## Commands

- **AutoMax Terminal: Re-sync panel state** (`automaxTerminal.resync`) — see the [known limitation](#known-limitation) below.

## Known limitation

VS Code exposes the maximized panel only as a **toggle** (`workbench.action.toggleMaximizedPanel`) and gives extensions **no way to read** whether the panel is currently maximized. So the extension tracks that state internally.

If you maximize or restore the panel **by hand** (e.g. via the native shortcut or the panel's `···` menu), the internal tracking can drift and the extension may do the opposite of what you expect on the next tab change. To fix it:

1. Put the panel back in its **normal (non-maximized)** state.
2. Run **AutoMax Terminal: Re-sync panel state** from the Command Palette.

The extension will reset its tracking and re-apply the correct layout for your current editor count.

## Development

The extension is plain JavaScript — no build step. Open the folder in VS Code and press `F5` to launch an Extension Development Host with the extension loaded.

## Updating

Because it's installed from a local `.vsix`, there's no auto-update. After changing the code:

1. Bump `version` in `package.json` (and add a `CHANGELOG.md` entry).
2. Repackage and reinstall:

   ```bash
   npx @vscode/vsce package && code --install-extension automax-terminal-*.vsix --force
   ```

3. Reload the window.

## License

[MIT](./LICENSE)
