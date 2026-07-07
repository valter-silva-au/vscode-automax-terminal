# AutoMax Terminal

A tiny VS Code extension that **automatically maximizes the panel (terminal, problems, output, etc.) when no editors are open**, and **restores it as soon as you open a file**.

Handy if you like to work in a maximized terminal but want the editor to take over the moment you open a file — without reaching for a keyboard shortcut every time.

## How it works

VS Code fires an event whenever the set of open editor tabs changes. This extension counts the open tabs across all tab groups:

- **0 tabs open** → maximize the panel (`workbench.action.toggleMaximizedPanel`)
- **≥1 tab open** → restore the panel

It re-checks on tab changes, active-editor changes, and on startup.

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `automaxTerminal.enabled` | `true` | Automatically maximize the panel when no editors are open, and restore it when a file is opened. |

## Commands

- **AutoMax Terminal: Re-sync panel state** (`automaxTerminal.resync`) — see the caveat below.

## Known limitation

VS Code exposes the maximized panel only as a **toggle** (`workbench.action.toggleMaximizedPanel`) and gives extensions **no way to read** whether the panel is currently maximized. So the extension tracks that state internally.

If you maximize or restore the panel **by hand** (e.g. via the native shortcut or the panel's `···` menu), the internal tracking can drift and the extension may do the opposite of what you expect on the next tab change. To fix it:

1. Put the panel back in its **normal (non-maximized)** state.
2. Run **AutoMax Terminal: Re-sync panel state** from the Command Palette.

The extension will reset its tracking and re-apply the correct layout for your current editor count.

## Install from source

```bash
# from the extension folder
npm install            # installs @vscode/vsce (only needed to package)
npx vsce package       # produces automax-terminal-<version>.vsix
code --install-extension automax-terminal-0.1.0.vsix
```

Or, for quick local development, copy/symlink this folder into your VS Code extensions directory:

- Windows: `%USERPROFILE%\.vscode\extensions\automax-terminal`
- macOS/Linux: `~/.vscode/extensions/automax-terminal`

Then reload the window (**Developer: Reload Window**).

## Development

The extension is plain JavaScript — no build step. Open the folder in VS Code and press `F5` to launch an Extension Development Host.

## License

[MIT](./LICENSE)
