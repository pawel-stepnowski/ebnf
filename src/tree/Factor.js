import { SpecialSequence } from "./SpecialSequence.js";
import { Identifier } from "./Identifier.js";
import { BracketedSequence } from "./BracketedSequence.js";
import { TerminalString } from "./TerminalString.js";
import { Token } from "./Token.js";
import { Integer } from "./Integer.js";
import { NonTerminal } from "./NonTerminal.js";

export class Factor extends NonTerminal
{
    /**
     * @param {TerminalString | Identifier | BracketedSequence | SpecialSequence} primary
     * @param {Integer} repetition
     * @param {Token} operator
     */
    constructor(primary, repetition, operator)
    {
        super();
        this.primary = primary;
        this.repetition = repetition;
        this.operator = operator;
    }

    get children()
    {
        return [this.repetition, this.operator, this.primary];
    }
}