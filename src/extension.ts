/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch-native';
import { completeFunction, getUnitTest } from './llmService';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let test = vscode.commands.registerCommand('freepilot.test', () => {
        let editor = vscode.window.activeTextEditor;
        let selection = editor?.selection;
        let highlighted: string | undefined = '';
        if (selection && !selection.isEmpty) {
            let selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            highlighted = editor?.document.getText(selectionRange);
        }
        
        vscode.window.showInformationMessage('Writing test...');
        getUnitTest(highlighted).then(response => {
            console.log(String.raw`${response.results[0].text.split('```')}`);
            editor?.edit(edit => {
                if (selection) {
                    edit.insert(new vscode.Position(selection.end.line + 1, 0), "\n" + response.results[0].text.split('```')[1]);
                }
            });
        });
    });
    context.subscriptions.push(test);

    let evaluate = vscode.commands.registerCommand('freepilot.evaluate', () => {
        let startingContext = "Below is an instruction that describes a task. Write a response that appropriately completes the request. \n ### Human: What does the following python code do? \n";
        let editor = vscode.window.activeTextEditor;
        let selection = editor?.selection;
        let highlighted: string | undefined = '';
        if (selection && !selection.isEmpty) {
            let selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            highlighted = editor?.document.getText(selectionRange);
        }
        vscode.window.showInformationMessage('Working...');
        completeLLaMa(highlighted, startingContext).then(response => {
            vscode.window.showInformationMessage(response.results[0].text);
        });
        // console.log(vscode.window.visibleTextEditors[0].viewColumn);
    });
    context.subscriptions.push(evaluate);

    let complete = vscode.commands.registerCommand('freepilot.complete', () => {
        let editor = vscode.window.activeTextEditor;
        let selection = editor?.selection;
        let highlighted: string | undefined = '';
        if (selection && !selection.isEmpty) {
            let selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            highlighted = editor?.document.getText(selectionRange);
        }
        vscode.window.showInformationMessage('Working...');
        completeFunction(highlighted).then(response => {
            editor?.edit(edit => {
                if (selection) {
                    edit.insert(new vscode.Position(selection.end.line + 1, 0), response.results[0].text);
                }
            });
        });
    });
    context.subscriptions.push(complete);

}

let host = '192.168.1.115:5000';
let uri = 'http://' + host + '/api/v1/generate';

let startingContext = "Below is an instruction that describes a task. Write a response that appropriately completes the request. \n";
let conversation = startingContext;


async function completeLLaMa(inPrompt: string | undefined, startingContext: string) {
    try {
        const response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify({
                'prompt': startingContext + inPrompt + "\n### Assistant:",
                'max_new_tokens': 250,
                'do_sample': true,
                'temperature': 1,
                'top_p': 0.5,
                'typical_p': 1,
                'repetition_penalty': 1.18,
                'top_k': 40,
                'min_length': 0,
                'no_repeat_ngram_size': 0,
                'num_beams': 1,
                'penalty_alpha': 0,
                'length_penalty': 1,
                'early_stopping': false,
                'seed': -1,
                'add_bos_token': true,
                'truncation_length': 2048,
                'ban_eos_token': false,
                'skip_special_tokens': true,
                'stopping_strings': []
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        console.log(startingContext + inPrompt + "\n### Assistant:");
        const result = (await response.json());
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log('request failed');
            return error.message;
        } else {
            console.log('unknown error');
            return 'an unexpected error occured';
        }
    }
}


// This method is called when your extension is deactivated
export function deactivate() {}