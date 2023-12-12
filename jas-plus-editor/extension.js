const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "AS Bundler" is now active!');

	let disposable = vscode.commands.registerCommand('jas-plus-editor.as-bundler', function () {

		const activeEditor = vscode.window.activeTextEditor
		const filePropertiesExtension = activeEditor.document.fileName.endsWith(".properties");
		if (filePropertiesExtension) {

			vscode.window.showInformationMessage('Hello World from AS Bundler!');

			//const document = activeEditor.document;
			var firstLine = activeEditor.document.lineAt(0);
			var lastLine = activeEditor.document.lineAt(activeEditor.document.lineCount - 1);

			
			var myArray = [];
			
			const fullPropertiesContent = activeEditor.document.getText(new vscode.Range(firstLine.range.start, lastLine.range.end));
			console.log(" Inside de IF fileTextToCursor @@@@@ #####################################: " + fullPropertiesContent.normalize);

			fullPropertiesContent.normalize
			console.log(typeof fullPropertiesContent);



			const a = vscode.commands.executeCommand('editor.action.addSelectionToNextFindMatch');
			
			//const textLine = document.getWordRangeAtPosition();
			const textLine = vscode.commands.executeCommand('editor.action.addSelectionToNextFindMatch');
		}
	});

	vscode.workspace.onDidChangeTextDocument(changeEvent => {
		console.log(`Did change: ${changeEvent.document.uri}`);

		for (const change of changeEvent.contentChanges) {
			console.log(change.range); // range of text being replaced
			console.log(change.text); // text replacement
		}
	});

	//context.subscriptions.push(disposable);
}

async function test1() {
	const saveFile = vscode.commands.executeCommand['workbench.action.files.save'];
	if (saveFile) {

	}
}
// This method is called when your extension is deactivated
function deactivate() {
	console.log('deactivate')
}

module.exports = {
	activate,
	deactivate
}
