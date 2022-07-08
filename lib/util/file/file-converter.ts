/*
 * File: file-converter.ts
 * Project: bt-api
 * File Created: Wednesday, 6th July 2022 12:56:38 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Wednesday, 6th July 2022 12:56:41 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */

class FileConverter{
    /**
     * Converts a base64 string to buffer. Does not assume fileContent to be a valid base64 string and throws an exception if it is not.
     * @throws Error: 'File conversion error, content passed is not a valid base64 string.'
     * @param fileContent base64 encoded file content
     * @returns buffer representation of the file content passed
     */
    public base64ToBufferSafe(fileContent: string): Buffer{
        const buf = Buffer.from(fileContent, 'base64');
        if(buf.toString('base64') !== fileContent) throw new Error('File conversion error, content passed is not a valid base64 string.');
        return buf;
    }
    /**
     * Converts a base64 string to buffer. Assumes that `fileContent` is a valid base64 string. For safe conversion use `base64ToBufferSafe()`.
     * @param fileContent base64 encoded file content
     * @returns buffer representation of the file content passed
     */
    public base64ToBuffer(fileContent: string): Buffer{
        return Buffer.from(fileContent, 'base64');
    }

    /**
     * Declarative wrapper for ``Buffer.toString('base64')``
     * @param buffer file content buffer
     * @returns (string) file content base64 encoded
     */
    public bufferToBase64(buffer: Buffer): string{
        return buffer.toString('base64');
    }

    public uInt8ArrayToBase64(buffer: Uint8Array):string{
        return Buffer.from(buffer).toString('base64');
    }
}

const fileConverter = new FileConverter();

export default fileConverter;