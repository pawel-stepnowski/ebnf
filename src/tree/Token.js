import { Terminal } from "./Terminal.js";
/** @typedef {import("../index").LexerTokenName} LexerTokenName */

export class Token extends Terminal
{
    /**
     * @param {string} value
     * @param {LexerTokenName} name
     */
    constructor(value, name)
    {
        super();
        this.value = value;
        this.name = name;
    }
    
    /**
     * @param {{ with_gap?: boolean }} [options]
     */
    toString(options)
    {
        return super.toString(options) + this.value;
    }
}