import { BracketedSequence } from "./BracketedSequence.js";
import { Factor } from "./Factor.js";
import { Identifier } from "./Identifier.js";
import { NonTerminal } from "./NonTerminal.js";
import { SpecialSequence } from "./SpecialSequence.js";
import { TerminalString } from "./TerminalString.js";
import { Token } from "./Token.js";

export class InfixTerm extends NonTerminal
{
    /**
     * @param {Identifier | Factor | TerminalString | BracketedSequence | SpecialSequence} first_primary
     * @param {Identifier | Factor | TerminalString | BracketedSequence | SpecialSequence} second_primary
     * @param {Token} operator
     */
    constructor(first_primary, second_primary, operator)
    {
        super();
        this.first_primary = first_primary;
        this.first_primary.parent = this;
        this.operator = operator;
        this.operator.parent = this;
        this.second_primary = second_primary;
        this.second_primary.parent = this;
    }

    get children()
    {
        return [this.first_primary, this.operator, this.second_primary];
    }
}