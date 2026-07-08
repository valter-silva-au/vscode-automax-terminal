# Changelog

## 0.2.1

- Fix: maximize the panel **immediately** when the last file closes. Two events
  fired in the same tick and each toggled the panel, cancelling out; the state
  is now committed before awaiting, with an in-flight guard, so a single clean
  toggle runs.

## 0.2.0

- Add an extension icon.
- Modernized README (logo, badges, feature grid, before/after diagram).
- No functional changes to the extension behavior.

## 0.1.0

- Initial release.
- Maximize the panel when no editors are open; restore it when a file is opened.
- `automaxTerminal.enabled` setting to toggle the behavior.
- `automaxTerminal.resync` command to recover from manual panel toggling.
