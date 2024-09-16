/* eslint-disable @typescript-eslint/naming-convention */

import fetch from 'node-fetch-native';

let host = '0.0.0.0:5000';
let uri = 'http://' + host + '/api/v1/generate';

let startingContextUnitTest = "A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions. USER: Write a unit test for the following function: \n ";
let completeCode = "A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions. USER: Complete the following function and do not repeat the function in your response: \n";

export async function getUnitTest(inFunction: string | undefined) {
    try {
        const response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify({
                'prompt': startingContextUnitTest + inFunction + "\n Do not repeat the same function in your response. \n Assistant: ",
                'max_new_tokens': 500,
                'do_sample': true,
                'temperature': 0.7,
                'top_p': 0.1,
                'typical_p': 1,
                'repetition_penalty': 1.18,
                'top_k': 40,
                'min_length': 0,
                'no_repeat_ngram_size': 0,
                'num_beams': 1,
                'penalty_alpha': 0,
                'length_penalty': 1,
                'early_stopping': false,
                'seed': 101,
                'add_bos_token': true,
                'truncation_length': 2048,
                'ban_eos_token': false,
                'skip_special_tokens': true,
                'stopping_strings': ['AI:', 'ASSISTANT:']
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
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

export async function completeFunction(inFunction: string | undefined) {
    try {
        console.log('attempting to complete function');
        const response = await fetch(uri, {
            method: 'POST',
            body: JSON.stringify({
                'prompt': completeCode + inFunction,
                'max_new_tokens': 300,
                'do_sample': true,
                'temperature': 0.7,
                'top_p': 0.1,
                'typical_p': 1,
                'repetition_penalty': 1.18,
                'top_k': 40,
                'min_length': 0,
                'no_repeat_ngram_size': 0,
                'num_beams': 1,
                'penalty_alpha': 0,
                'length_penalty': 1,
                'early_stopping': false,
                'seed': 101,
                'add_bos_token': true,
                'truncation_length': 2048,
                'ban_eos_token': false,
                'skip_special_tokens': true,
                'stopping_strings': ['AI:', 'ASSISTANT:']
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = (await response.json());
        return result;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);
            console.log('request failed');
            return error.message;
        } else {
            console.log('unknown error');
            return 'an unexpected error occured';
        }
    }
}