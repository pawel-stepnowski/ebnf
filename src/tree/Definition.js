import * as Utilities from "../utilities/index.js";
import { BracketedSequence } from "./BracketedSequence.js";
import { Factor } from "./Factor.js";
import { Identifier } from "./Identifier.js";
import { InfixTerm } from "./InfixTerm.js";
import { SpecialSequence } from "./SpecialSequence.js";
import { TerminalString } from "./TerminalString.js";
import { Token } from "./Token.js";
import { NonTerminal } from "./NonTerminal.js";
import { Symbol } from "./Symbol.js";

export class Definition extends NonTerminal
{
    /**
     * @param {(Identifier | Factor | TerminalString | BracketedSequence | SpecialSequence | InfixTerm)[]} factors
     * @param {Token[]} [separators]
     */
    constructor(factors, separators)
    {
        super();
        this.factors = factors;
        this.separators = separators;
    }

    /**
     * @returns {Symbol[]}
     */
    get children()
    {
        return Utilities.Array.join(this.factors, this.separators);
    }
}