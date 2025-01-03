import { Terminal } from "./Terminal.js";
import { TerminalBrackets } from "./TerminalBrackets.js";

export class SpecialSequence extends Terminal
{
    /**
     * @param {string} value 
     * @param {TerminalBrackets} brackets
     */
    constructor(value, brackets)
    {
        super();
        this.value = value;
        this.brackets = brackets;
    }

    /**
     * @param {{ with_gap?: boolean }} [options]
     */
    toString(options)
    {
        return super.toString(options) + this.brackets.opening_symbol + this.value + this.brackets.closing_symbol;
    }
}
