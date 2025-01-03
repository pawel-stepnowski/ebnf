import { DefinitionList } from "./DefinitionList.js";
import { Identifier } from "./Identifier.js";
import { NonTerminal } from "./NonTerminal.js";
import { Token } from "./Token.js";

export class Rule extends NonTerminal
{
    /**
     * @param {Identifier} identifier 
     * @param {DefinitionList} definitions 
     * @param {Token} operator 
     * @param {Token} terminator
     */
    constructor(identifier, definitions, operator, terminator)
    {
        super();
        this.identifier = identifier;
        this.definitions = definitions;
        this.operator = operator;
        this.terminator = terminator;
    }

    get children()
    {
        return [this.identifier, this.operator, this.definitions, this.terminator];
    }
}