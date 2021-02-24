// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "golang-comments" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('golang-comments.generateComments', () => {
		
		// Make sure there is an active editor
		var editor = vscode.window.activeTextEditor;
		if (editor) {
			
			// Make sure it's a Go file
			var lang = editor.document.languageId;
			if (lang === "go") {

				// Get the text of the current line
				const text = editor.document.lineAt(editor.selection.active.line).text.trim().replace(/\s+/g,' ');

				// Get the line to add the comment to
				var startLine = editor.selection.active.line - 1;

				//  Find the name
				let name = null;
				
				// First we need to know if we are dealing with a type or function/method
				if (text.startsWith('type')) {
					// type child struct {
					name = text.split(' ')[1];
				} else {
					const match = text.match(/(\w+)\({1}/);
					if (match && match.length > 0) {
						name = match[1];
					}
				}

				// If we have text to insert
				if (name && name.length > 0) {

					// Get the editor
					let editor = vscode.window.activeTextEditor;
					if (editor) {
						var textToInsert = `// ${name} `;
						editor.edit((editBuilder: vscode.TextEditorEdit) => {
							if (startLine < 0) {
								//If the function declaration is on the first line in the editor we need to set startLine to first line
								//and then add an extra newline at the end of the text to insert
								startLine = 0;
								textToInsert += '\n';
							}
							
							let editor = vscode.window.activeTextEditor;
							if (editor) {
									//Check if there is any text on startLine. If there is, add a new line at the end
									var pos = new vscode.Position(startLine, 0);	
									
									// Get the preceding whitespace
									const match = editor.document.lineAt(editor.selection.active.line).text.match(/(\s*)/g);

									// Add it back in to the comment
									if (match && match.length > 0) {
										textToInsert = match[0] + textToInsert;
									}
									
									// Add a newline
									textToInsert = '\n' + textToInsert;

									// Insert
									editBuilder.insert(pos, textToInsert);

									// Move the cursor to the end of the comment line
									let range = editor.document.lineAt(pos).range;
									editor.selection =  new vscode.Selection(range.start, range.end);
									editor.revealRange(range);
							}
						}).then(() => {});

						return;
					}
				}
			}
		} 

		// Display an error message box to the user
		//vscode.window.showInformationMessage('There was an error parsing your function.');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
