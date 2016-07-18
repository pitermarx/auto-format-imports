'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let importRegex = /import\s+([^"']*)(from\s+)?["'](.+)["'];?/g;
let importPartsRegex = /((\* as [^,]+)+|({[^}]+})|([^*{,\s]+))/g;
interface IImport {
    from: string,
    import: string
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "auto-format-imports" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerTextEditorCommand('extension.format-imports', e => {
        var editor = vscode.window.activeTextEditor;
        if (!editor || !editor.document) {
            return; // No open text editor
        }
        
        let allText = editor.document.getText();
        var match;
        var imports = [];
        while ((match = importRegex.exec(allText)) !== null) {
            var fromPart = match[3].trim();
            var importPart = match[1].trim() as string;
            if (importPart.endsWith("from")) {
                importPart = importPart.substr(0, importPart.length - 4).trim()
            }
            imports.push({
                from: fromPart,
                import: importPart
            })
        }
        imports = imports.sort((a, b) => a.from > b.from ? 1 : -1);
        var lines = imports.reduce((prev, c) => prev + 1 + (c.import.match(/\n/g) || []).length, 0);
        console.log(lines)
        console.log(imports.map(i => `import ${i.import} from "${i.from}";\n`).join(""))
        // let importLineCount = 0;
        // for(let i = 0; i < doc.lineCount; i+=1) {
        //     let line = doc.lineAt(i);
        //     if (line.text.match(importRegex)) {
        //         let result = importRegex.exec(line.text);
        //         let importParts = result[1]
        //             .match(importPartsRegex)
        //             .map(p => p.startsWith("{") ? `{ ${p.replace("{", "").replace("}","").split(",").map(i => i.trim()).join(", ")} }` : p)
        //             .join(", ");
        //         lines.push({
        //             from: result[2].trim(),
        //             import: importParts
        //         })
        //     }
        //     else if (line.text.trim().length > 1) {
        //         break;
        //     }
        //     importLineCount += 1;
        // }
        // let sorted = lines.sort((a, b) => a.from > b.from ? -1 : 1);
        // let maxLen = Math.max.apply(null, lines.map(l => l.import.length));
        // let importLines = sorted.map(l => `import ${l.import} ${" ".repeat(maxLen-l.import.length)}from "${l.from}";`)

        // let rangeToReplace = new vscode.Range(new vscode.Position(0, 0), new vscode.Position(importLineCount, 0));
        // vscode.window.activeTextEditor.edit(builder => {
        //     builder.replace(rangeToReplace, importLines.join(vscode.EndOfLine.LF.toString()) + vscode.EndOfLine.LF.toString() + vscode.EndOfLine.LF.toString())
        // }); 
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}