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
  // VS Code only exposes a *toggle* for the maximized panel
  // (`workbench.action.toggleMaximizedPanel`) and no API to read the current
  // panel state, so we track it ourselves. If you maximize/restore the panel
  // by hand this flag can drift — run "AutoMax Terminal: Re-sync panel state"
  // (with the panel in its normal, non-maximized state) to reconcile.
  let maximized = false;

  async function toggle() {
    await vscode.commands.executeCommand('workbench.action.toggleMaximizedPanel');
  }

  async function sync() {
    if (!isEnabled()) return;

    const empty = countTabs() === 0;
    if (empty && !maximized) {
      await toggle();
      maximized = true;
    } else if (!empty && maximized) {
      await toggle();
      maximized = false;
    }
  }

  context.subscriptions.push(
    vscode.window.tabGroups.onDidChangeTabs(sync),
    vscode.window.onDidChangeActiveTextEditor(sync),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('automaxTerminal.enabled')) sync();
    }),
    // Recovery for drift: assume the panel is currently in its normal state,
    // reset tracking, then re-apply the correct layout for the editor count.
    vscode.commands.registerCommand('automaxTerminal.resync', async () => {
      maximized = false;
      await sync();
    })
  );

  // Apply the correct layout once the workbench has finished restoring.
  sync();
}

function deactivate() {}

module.exports = { activate, deactivate };
