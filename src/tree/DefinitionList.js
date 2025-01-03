import * as Utilities from "../utilities/index.js";
import { Definition } from "./Definition.js";
import { Token } from "./Token.js";
import { NonTerminal } from "./NonTerminal.js";
import { Symbol } from "./Symbol.js";

export class DefinitionList extends NonTerminal
{
    /**
     * @param {Definition[]} definitions
     * @param {Token[]} [separators]
     */
    constructor(definitions, separators)
    {
        super();
        this.definitions = definitions;
        this.separators = separators;
    }

    /**
     * @returns {Symbol[]}
     */
    get children()
    {
        /** @type {Symbol[]} */
        const definitions_as_symbols = this.definitions;
        return Utilities.Array.join(definitions_as_symbols, this.separators);
    }
}