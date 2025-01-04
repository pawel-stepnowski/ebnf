/** @typedef {import("./index.js").LexerPosition} LexerPosition */

export class SyntaxError extends Error
{
    /**
     * @param {string} message 
     * @param {LexerPosition} line_position 
     * @param {string} line_text 
     */
    constructor(message, line_position, line_text)
    {
        super(message);
        this.line_position = line_position;
        this.line_text = line_text;
    }

    toString()
    {
        return this.message
            + '\r\n' + this.line_text
            + '\r\n' + '\xa0'.repeat(this.line_position.offset - this.line_position.line_offset) + '^';
    }
}
