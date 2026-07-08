const vscode = require('vscode');

/** Count all open editor tabs across every tab group. */
function countTabs() {
  return vscode.window.tabGroups.all.reduce(
    (sum, group) => sum + group.tabs.length,
    0
  );
}

function isEnabled() {
  return vscode.workspace
    .getConfiguration('automaxTerminal')
    .get('enabled', true);
}

function activate(context) {
  // VS Code exposes the maximized panel only as a *toggle* with no way to read
  // its state, so we track it ourselves. Closing a file fires several events in
  // the same tick (onDidChangeTabs + onDidChangeActiveTextEditor); we commit the
  // intended state *before* awaiting the toggle, and guard against a toggle
  // already in flight, so a second event can't read a stale value and fire a
  // cancelling second toggle — which otherwise left the panel un-maximized until
  // the next unrelated event.
  let maximized = false;
  let inFlight = false;

  async function apply() {
    if (!isEnabled() || inFlight) return;

    const shouldMaximize = countTabs() === 0;
    if (shouldMaximize === maximized) return; // already in the desired state

    maximized = shouldMaximize; // commit intent synchronously, before awaiting
    inFlight = true;
    try {
      await vscode.commands.executeCommand('workbench.action.toggleMaximizedPanel');
    } finally {
      inFlight = false;
    }

    // Tabs may have changed while the toggle was in flight — reconcile once.
    if (isEnabled() && (countTabs() === 0) !== maximized) apply();
  }

  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabs(() => apply()),
    vscode.window.onDidChangeActiveTextEditor(() => apply()),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('automaxTerminal.enabled')) apply();
    }),
    // Recovery if the panel state drifts (e.g. you toggle it by hand):
    // put the panel in its normal state, then run this command.
    vscode.commands.registerCommand('automaxTerminal.resync', async () => {
      maximized = false;
      await apply();
    })
  );

  // Apply the correct layout once the workbench has finished restoring.
  apply();
}

function deactivate() {}

module.exports = { activate, deactivate };
