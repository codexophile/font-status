const vscode = require( 'vscode' );

function activate ( context ) {
  // Create a status bar item
  let statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  // Add to subscriptions
  context.subscriptions.push( statusBarItem );

  // Function to update the status bar with current font
  const updateStatusBar = () => {
    try {
      const config = vscode.workspace.getConfiguration( 'editor' );
      const fontFamilySetting = config.get( 'fontFamily' );
      const icon = '$(symbol-text)';

      if ( !fontFamilySetting ) {
        statusBarItem.text = `${ icon } Default`;
      } else {
        // Clean up font family string
        const matches = fontFamilySetting.match( /^(.+?)[,$]/ );
        const activeFontFamily = matches[ 1 ];
        statusBarItem.text = `${ icon } ${ activeFontFamily }`;
      }

      statusBarItem.tooltip = "Click to change font";
      statusBarItem.command = 'extension.changeFont';
      statusBarItem.show();
    } catch ( error ) {
      console.error( 'Error updating font status bar:', error );
      statusBarItem.text = "$(error) Font Error";
      statusBarItem.show();
    }
  };

  // Update status bar initially
  updateStatusBar();

  // Listen for font changes
  const configListener = vscode.workspace.onDidChangeConfiguration( event => {
    if ( event.affectsConfiguration( 'editor.fontFamily' ) ) {
      updateStatusBar();
    }
  } );

  // Add the listener to subscriptions
  context.subscriptions.push( configListener );

  // Register command to change font
  let disposable = vscode.commands.registerCommand( 'extension.changeFont', async () => {
    const config = vscode.workspace.getConfiguration( 'editor' );
    const currentFont = config.get( 'fontFamily' );
    const fonts = [
      'Consolas', 'Courier New', 'Monaco', 'Menlo', 'Source Code Pro', 'Fira Code', 'Droid Sans Mono', 'Inconsolata', 'Ubuntu Mono', 'JetBrains Mono'
    ];

    const selectedFont = await vscode.window.showQuickPick( fonts, {
      placeHolder: `Current font: ${ currentFont }`,
    } );

    if ( selectedFont ) {
      await config.update( 'fontFamily', selectedFont, vscode.ConfigurationTarget.Global );
    }
  } );

  context.subscriptions.push( disposable );
}

function deactivate () { }

module.exports = {
  activate,
  deactivate
};