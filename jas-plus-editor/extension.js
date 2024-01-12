
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "AS Bundler" is now active!');

	let disposable = vscode.commands.registerCommand('jas-plus-editor.as-bundler', async function () {

		const activeEditor = vscode.window.activeTextEditor
		const filePropertiesExtension = activeEditor.document.fileName.endsWith(".properties");
		if (filePropertiesExtension) {

			vscode.window.showInformationMessage('Hello World from AS Bundler!');

			var firstLine = activeEditor.document.lineAt(0);
			var lastLine = activeEditor.document.lineAt(activeEditor.document.lineCount - 1);



			const fullPropertiesContent = activeEditor.document.getText(new vscode.Range(firstLine.range.start, lastLine.range.end));


			//=====================================================================
			var fullListOfParameters = [];
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
					fullListOfParameters.push(content);
				}
				i++;
			}
			while (i < size)
			//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@  "+ myArray[myArray.length -1]);
			//console.log("WWWWWWWWWWWWWWWWWWWWWWWWW  "+ myArray);
			//myArray2.sort();
			//Get the group of each line/parameter
			var mapFull = new Map();
			var paramList = [];
			var mapTwo = new Map();

			//Get all line of hastag and group them by catagory
			mapTwo = hashtagRule(fullListOfParameters);

			fullListOfParameters.sort();

			var fullListOfParametersWithOutHastag = fullListOfParameters.filter(element => !element.startsWith("#"))

			fullListOfParametersWithOutHastag.forEach((element) => {

				const groupOfParameter = element.substring(0, element.indexOf("."));

				if (mapFull.has(groupOfParameter)) {

					paramList.push(element);
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
					let paramFormatted = arrayParameter[0];
					finalListParameters.push(paramFormatted);
				}
			});

			var finalBlockOfParameters = "\n";
			var hashTagtest = "";
			finalListParameters.sort();
			finalListParameters.forEach((element) => {

				console.log("WWWWWWWWWWWWWWWWWW " + element);
				const correntGroupOfParameter = element.substring(0, element.indexOf("."));

				// hashTagtest = addHashTagToParameter(element, mapTwo);

				var hashtagGroup = "";
				var paramNameOfHashtag = element.substring(0, element.indexOf("."));
				mapTwo.forEach((arrayHashtag, key) => {
					if (key.includes(paramNameOfHashtag)) {
						arrayHashtag.forEach((element => {
							finalBlockOfParameters += element + "\n"
						}))
						mapTwo.delete(key);
					}
					// finalBlockOfParameters += element + "\n"
				});

				// console.log("ffffffffffffffffffff "+ hashtagGroup);
				// console.log("AAAAA9999999999999 " + hashTagtest);
				finalBlockOfParameters += element + "\n"
			});

			// select all the text and run formatSelection
			await vscode.commands.executeCommand('editor.action.selectAll');
			await vscode.commands.executeCommand('editor.action.deleteLines');
			await vscode.commands.executeCommand('cancelSelection')
			// await vscode.commands.executeCommand('workbench.action.files.saveAll');


			activeEditor.edit(async builder => {
				builder.insert(new vscode.Position(0, 0), finalBlockOfParameters);

				await vscode.commands.executeCommand('workbench.action.files.saveAll');
			})





		}
	});
}
/**
 * Return a Map with a list of parameters that cotains comments
 * 
 * @param {string[]} listOfParameters
 */
function hashtagRule(listOfParameters) {
	var mapOfHashTagByGroup = new Map();
	var hashTagListByGroup = [];
	var groupOfParameter;
	var lasParameterHashtag = false;

	listOfParameters.forEach((element) => {

		if (element.startsWith("#")) {
			hashTagListByGroup.push(element);
			lasParameterHashtag = true;
		} else if (lasParameterHashtag) {
			groupOfParameter = element.substring(0, element.indexOf("."));
			mapOfHashTagByGroup.set(groupOfParameter, hashTagListByGroup);
			lasParameterHashtag = false;
			hashTagListByGroup = [];
		}
	});

	return mapOfHashTagByGroup;
}

function addHashTagToParameter(parameter, mapOfHash) {
	var hashtagGroup = "";
	var newMap = new Map(Object.entries(mapOfHash));
	console.log("AAAAAAAAAAAAAAAAA  " + typeof(newMap))
	newMap.set(mapOfHash);
	var paramNameOfHashtag = parameter.substring(0, parameter.indexOf("."));
	newMap.forEach((arrayHashtag, key) => {
		if (parameter.includes(paramNameOfHashtag)) {
			arrayHashtag.forEach((element => {
				// console.log("AAAAA9999999999999 " + element)
				hashtagGroup += element;
				hashtagGroup.concat("\r\n");
			}))
		}
		newMap.delete(key);
	});

	return hashtagGroup;
}

// This method is called when your extension is deactivated
function deactivate() {
	console.log('deactivate')
}

module.exports = {
	activate,
	deactivate
}

