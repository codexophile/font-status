const vscode = require( 'vscode' );

function activate ( context ) {
  // Create a status bar item
  const statusBarItem = vscode.window.createStatusBarItem( vscode.StatusBarAlignment.Right, 100 );
  statusBarItem.command = 'editor.action.fontName'; // Optional: Add a command to trigger when clicked
  context.subscriptions.push( statusBarItem );

  // Function to update the status bar with the current font
  const updateStatusBar = () => {
    const config = vscode.workspace.getConfiguration( 'editor' );
    const fontFamily = config.get( 'fontFamily' ); // Get the current font family
    statusBarItem.text = `Font: ${ fontFamily }`; // Display the font name in the status bar
    statusBarItem.show(); // Make the status bar item visible
  };

  // Update the status bar initially
  updateStatusBar();

  // Listen for configuration changes (e.g., when the font is changed)
  vscode.workspace.onDidChangeConfiguration( ( event ) => {
    if ( event.affectsConfiguration( 'editor.fontFamily' ) ) {
      updateStatusBar();
    }
  } );
}

function deactivate () { }

module.exports = {
  activate,
  deactivate
};