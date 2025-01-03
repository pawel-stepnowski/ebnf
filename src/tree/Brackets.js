import { Terminal } from "./Terminal.js";
import { Token } from "./Token.js";

export class Brackets extends Terminal
{
    /**
     * @param {Token} opening_symbol
     * @param {Token} closing_symbol
     */
    constructor(opening_symbol, closing_symbol)
    {
        super();
        this.opening_symbol = opening_symbol;
        this.closing_symbol = closing_symbol;
    }
}