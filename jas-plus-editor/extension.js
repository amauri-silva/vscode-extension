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



			const fullPropertiesContent = activeEditor.document.getText(new vscode.Range(firstLine.range.start, lastLine.range.end));
			// console.log(" Inside de IF fileTextToCursor @@@@@ #####################################: " + fullPropertiesContent);
			// console.log(typeof fullPropertiesContent);


			//=====================================================================
			var myArray = [];
			var finalListParameters = [];
			var map = new Map();
			let lastGroupOfParameter = "";

			const size = activeEditor.document.lineCount;
			var i = 0;

			// Get all lines of the OpenTextEditor =====================================================================
			do {
				var firstLine = activeEditor.document.lineAt(i);
				const content = activeEditor.document.getText(new vscode.Range(firstLine.range.start, firstLine.range.end));
				if (content != "") {
					myArray.push(content);
					const correntGroupOfParameter = content.substring(0, content.indexOf("."));
				}
				i++;
			}
			while (i < size)
			//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@  "+ myArray[myArray.length -1]);
			myArray.sort();
			//console.log("WWWWWWWWWWWWWWWWWWWWWWWWW  "+ myArray);

			//myArray2.sort();


			//=====================================================================
			//Get the group of each line/parameter
			var mapFull = new Map();
			var paramList = [];
			myArray.forEach((element) => {

				const groupOfParameter = element.substring(0, element.indexOf("."));

				if (mapFull.has(groupOfParameter)) {

					paramList.push(element);
					//console.log(" groupOfParameter  QQQQQQQQQQQQQQQQQQQQQQQQQ  " + paramList);
					mapFull.set(groupOfParameter, paramList);

				} else {
					paramList = [];
					paramList.push(element);
					mapFull.set(groupOfParameter, paramList);
				}
			});

			mapFull.forEach((arrayParameter, key) => {

				var currentGroupOfParam = [];
				var currentIndexEquals = 0;
				var maxEqualsIndex = 0;
				var lastKey = "";

				//get the array with size > 1
				if (arrayParameter.length > 1) {
					arrayParameter.forEach((element) => {
						//console.log(" Inside de IF EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE "+ element + "  wwwwww   "+ key);

						//get the intex of  =
						currentIndexEquals = element.indexOf("=");

						if (currentIndexEquals > maxEqualsIndex) {
							maxEqualsIndex = currentIndexEquals;
						}

						currentGroupOfParam.push(element);
						lastKey = key;
					});

					// set characteres at the maxEqualsIndex
					currentGroupOfParam.forEach((paramLine) => {

						// curt the value begining with = util the end of line
						let sliceByIndexEquals = paramLine.substring(paramLine.indexOf("="));

						// remove the characteres after equals symbol
						let paramFormatted = paramLine.slice(0, paramLine.indexOf(" "));

						// Past at the max index of =
						paramFormatted = paramFormatted.padEnd(maxEqualsIndex, " ") + sliceByIndexEquals;
						finalListParameters.push(paramFormatted);
					});

				} else {
					// TODOOOOOO
					let paramFormatted = arrayParameter[0];
					paramFormatted = arrayParameter.slice(0, arrayParameter.indexOf(","));
					console.log(" TEST  AAAAAAAAAAAAAAAAAAAAAAAAAAAAA  " + paramFormatted);
					finalListParameters.push(paramFormatted);
				}
			});

			finalListParameters.sort();
			finalListParameters.forEach((aa) => {

				// console.log(" TEST  AAAAAAAAAAAAAAAAAAAAAAAAAAAAA  " + aa);
			});


			// Clean the ActiveTextEditor
			activeEditor.edit(builder => {
				vscode.commands.executeCommand('editor.action.selectAll');
				vscode.commands.executeCommand('editor.action.clipboardCutAction');
			})

		}
	});
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
