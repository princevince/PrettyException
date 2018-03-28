'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, ExtensionContext, TextDocument, TextEditor, Range } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "izzyex" is now active!');

    let prettifier = new Prettifier();

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        prettifier.prittify();

        // Display a message box to the user
        window.showInformationMessage('Exception should be pretty now!!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class Prettifier {

    prittify(): void {

        // Get the current text editor
        let editor = window.activeTextEditor;

        // If no editor is open, we get 'undifined'
        if (!editor) {
            window.showInformationMessage('Open a new text editor first!');
            return;
        }

        // Prettify JSON before any text modifications
        commands.executeCommand("extension.prettifyJSON")
            .then(_ => {
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

    getWholeDocumentRange(doc: TextDocument): Range {
        let textLength = doc.getText().length;
        let wholeDocumentTextRange = new Range(
            doc.positionAt(0),
            doc.positionAt(textLength - 1));
        return wholeDocumentTextRange;
    }

    replaceAll(text: string, search: string, replacement: string) {
        return text.split(search).join(replacement);
    };
} 