import { Brackets } from "./Brackets.js";
import { DefinitionList } from "./DefinitionList.js";
import { NonTerminal } from "./NonTerminal.js";

export class BracketedSequence extends NonTerminal
{
    /**
     * @param {DefinitionList} definitions 
     * @param {Brackets} brackets
     */
    constructor(definitions, brackets)
    {
        super();
        this.definitions = definitions;
        this.definitions.parent = this;
        this.brackets = brackets;
        this.brackets.parent = this;
    }

    get children()
    {
        return [this.brackets.opening_symbol, this.definitions, this.brackets.closing_symbol];
    }
}