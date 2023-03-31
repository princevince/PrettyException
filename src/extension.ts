// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pretty-exception" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pretty-exception.prettify', () => {
		// The code you place here will be executed every time your command is executed

		let prettifier = new Prettifier();
		prettifier.prettify();

		// Display a message box to the user
		vscode.window.showInformationMessage('Exception should be pretty now!!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

class Prettifier {

    prettify(): void {

        // Get the current text editor
        let editor = vscode.window.activeTextEditor;

        // If no editor is open, we get 'undefined'
        if (!editor) {
            vscode.window.showInformationMessage('Open a new text editor first!');
            return;
        }

        // Prettify JSON before any text modifications
        vscode.commands.executeCommand("extension.prettifyJSON")
            .then((_: any) => {
                if (editor === undefined) {
                    return;
                }

                // Modify whole JSON
                let doc = editor.document;
                let range = this.getWholeDocumentRange(doc);
                editor.edit(e => {
                    let text = doc.getText();

                    while (text.includes('\\\\')) {
                        text = this.replaceAll(text, '\\\\', '\\'); // Replace \\ with \
                    }
                    text = this.replaceAll(text, '\\r\\n', '\r\n'); // TODO make it configurable
                    e.replace(range, text);
                });
            });
    }

    getWholeDocumentRange(doc: vscode.TextDocument): vscode.Range {
        let textLength = doc.getText().length;
        let wholeDocumentTextRange = new vscode.Range(
            doc.positionAt(0),
            doc.positionAt(textLength - 1));
        return wholeDocumentTextRange;
    }

    replaceAll(text: string, search: string, replacement: string) {
        return text.split(search).join(replacement);
    };
} 