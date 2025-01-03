import { TerminalBrackets } from "./TerminalBrackets.js";

export class Comment
{
    /**
     * @param {string} value 
     * @param {TerminalBrackets} brackets
     */
    constructor(value, brackets)
    {
        this.value = value;
        this.brackets = brackets;
    }

    toString()
    {
        return this.brackets.opening_symbol + this.value + this.brackets.closing_symbol;
    }
}