
const vscode = require('vscode');

// This method is called when the extension is activated
// Your extension is activated the very first time the command is executed
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('The extension of "AS Bundler" was executed!');

		vscode.commands.registerCommand('as-bundler-editor.as-bundler', async function () {

		const activeEditor = vscode.window.activeTextEditor
		const filePropertiesExtension = activeEditor.document.fileName.endsWith(".properties");
		if (filePropertiesExtension) {

			var firstLine = activeEditor.document.lineAt(0);
			var fullListOfParameters = [];
			var finalListParameters = [];
			const size = activeEditor.document.lineCount;
			var i = 0;

			// TODO ----------------------------------------------------------------------------------------------------------
			// Get all lines of the OpenTextEditor
			do {
				var firstLine = activeEditor.document.lineAt(i);
				const content = activeEditor.document.getText(new vscode.Range(firstLine.range.start, firstLine.range.end));
				if (content != "") {
					fullListOfParameters.push(content);
				}
				i++;
			}
			// END ----------------------------------------------------------------------------------------------------------


			while (i < size)
			var mapOfParameters = new Map();
			var paramList = [];
			var groupOfComments = new Map();
			var parameterLine = "";

			//Get all line of hastag and group them by catagory
			groupOfComments = hashtagRule(fullListOfParameters);

			fullListOfParameters.sort();

			// TODO ----------------------------------------------------------------------------------------------------------
			var fullListOfParametersWithOutHastag = fullListOfParameters.filter(element => !element.startsWith("#") && !element.startsWith("//"))

			fullListOfParametersWithOutHastag.forEach((element) => {

				const groupOfParameter = element.substring(0, element.indexOf("."));

				if (mapOfParameters.has(groupOfParameter)) {
					parameterLine = treatParameter(element);
					paramList.push(parameterLine);
					mapOfParameters.set(groupOfParameter, paramList);

				} else {
					paramList = [];
					parameterLine = treatParameter(element);
					paramList.push(parameterLine);
					mapOfParameters.set(groupOfParameter, paramList);
				}
			});

			// END ----------------------------------------------------------------------------------------------------------



			// TODO ----------------------------------------------------------------------------------------------------------
			mapOfParameters.forEach((arrayParameter, key) => {

				var currentGroupOfParam = [];
				var currentIndexEquals = 0;
				var maxEqualsIndex = 0;
				var lastKey = "";

				//get the array with size > 1
				if (arrayParameter.length > 1) {
					arrayParameter.forEach((element) => {

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
			// END ----------------------------------------------------------------------------------------------------------




			// TODO ----------------------------------------------------------------------------------------------------------
			var finalBlockOfParameters = "\n";
			var hashTagtest = "";
			var currentParam = "";
			var lastParam = "";
			var arrayHashtag = [];
			finalListParameters.sort();
			finalListParameters.forEach((parameter) => {
				currentParam = parameter.substring(0, parameter.indexOf("="));
				currentParam = currentParam.split(" ").join("");

				var paramInitialGroup = currentParam.substring(0, currentParam.indexOf("."));
				if (lastParam.length > 0 && paramInitialGroup != lastParam) {
					finalBlockOfParameters += "\n";
				}

				if (groupOfComments.has(currentParam)) {
					arrayHashtag = groupOfComments.get(currentParam);
					arrayHashtag.forEach((comment) => {
						finalBlockOfParameters += comment + "\n"
					});
				}
				finalBlockOfParameters += parameter + "\n";
				lastParam = paramInitialGroup;
			});
			// END ----------------------------------------------------------------------------------------------------------


			// select all the text and run formatSelection
			await vscode.commands.executeCommand('editor.action.selectAll');
			await vscode.commands.executeCommand('editor.action.deleteLines');
			await vscode.commands.executeCommand('cancelSelection')

			activeEditor.edit(async builder => {
				builder.insert(new vscode.Position(0, 0), finalBlockOfParameters);

				await vscode.commands.executeCommand('workbench.action.files.saveAll');
			})
		}
	});
}

/**
 * @param {string} element
 */
function treatParameter(element) {
	if (element.endsWith(" ")) {
		element = element.trim();
	}
	// TODO - There is a bug 
	element = putSpaceBetweenEqualSymbol(element);

	return element;
}

/**
 * @param {string} element
 */
function putSpaceBetweenEqualSymbol(element) {

	var element2 = findSpaceBeforeEqualSymbol(element);


	return element2;
}

/**
 * @param {string} element
 */
function findSpaceBeforeEqualSymbol(element) {

	if( !(/\s+=/.test(element))){
		element = element.split("=").join(" =");
	}

	if( !(/\s+=/.test(element)) || (/\s{2,}=/.test(element))){
		element = element.split(/\s{2,}=/).join(" =");
	}

	if(!(/=\s+/.test(element))){
		element = element.split("=").join("= ");
	}

	if(!(/=\s+/.test(element)) || ((/=\s{2,}/.test(element)))){
		element = element.split(/=\s{2,}/).join("= ");
	}

	return element;
}

/**
 * Return a Map with a list of parameters that cotains comments
 * 
 * @param {string[]} listOfParameters
 */
function hashtagRule(listOfParameters) {
	var mapOfHashTagByGroup = new Map();
	var finalMapOfComments = new Map();
	var lastParameter = "";
	var hashTagListByGroup = [];
	var groupOfParameter;
	var lasParameterHashtag = false;

	listOfParameters.forEach((element) => {

		if (element.startsWith("#")) {
			hashTagListByGroup.push(element);
			lasParameterHashtag = true;
		} else if (lasParameterHashtag) {
			groupOfParameter = element.substring(0, element.indexOf("="));
			mapOfHashTagByGroup.set(groupOfParameter.split(" ").join(""), hashTagListByGroup);
			lasParameterHashtag = false;
			hashTagListByGroup = [];
		}
	});

	var mapOfHashTagByGroupSorted = new Map([...mapOfHashTagByGroup.entries()].sort());

	return mapOfHashTagByGroupSorted;
}

module.exports = {
	activate
}

