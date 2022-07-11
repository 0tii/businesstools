/*
 * File: string-interpreter.ts
 * Project: bt-api
 * File Created: Monday, 11th July 2022 12:06:00 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Monday, 11th July 2022 12:06:03 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */
/**
 * Attempts to interpret a range string and return a tuple of the lowest and highest number in that range.\
 * Supported Formats:
 * - '1-5'
 * - '1 - 5'
 * @param str the range string
 * @returns [number, number] [lowest, highest]
 * @throws error 'Could not interpret range value'
 */
export function interpretRangeString(str: string): [number, number] {
    let numArray = str.split('-');
    let numbers: [number, number] = [parseInt(numArray[0]), parseInt(numArray[1])];
    if (!numbers[0] || !numbers[1])
        throw new Error('Could not interpret range value');
    return numbers;
}

/**
 * Attempts to interpret a comma-separated enumeration string and return an array of all numbers enumerated.\
 * Suppored format:
 * - '1,4,7,9,133'
 * - '1, 4, 7, 9, 133'
 * @param str the enumeration string
 * @returns number[] containing all enumrated numbers
 * @throws error 'Could not interpret one or more values in the enumeration'
 */
export function interpretEnumerationString(str: string): number[] {
    let numbers: number[] = [];
    str.split(',').forEach((e) => {
        let num = parseInt(e.trim());
        if (num === NaN)
            throw new Error('Could not interpret one or more values in the enumeration');
        numbers.push(num);
    });
    return numbers;
}

/**
 * Attempts to interpret a variety of different number-formats from a string.\
 * Supported formats:
 * - Comma-separated list of numbers
 * - Single number
 * - Range of numbers
 * @param str 
 * @returns 
 */
export function interpretNumbers(str: string): number[] {
    //check for single number, then range, then enumeration
    let target: number[] = [parseInt(str.trim())];
    if (target[0] !== NaN) return target;
    let error: Error;
    try { return interpretRangeString(str) } catch (err: any) {  error = err }
    try { return interpretEnumerationString(str)} catch(err: any) { error = err}
    throw error;
}