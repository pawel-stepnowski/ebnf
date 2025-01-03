import { NonTerminal } from "./NonTerminal.js";
import { Rule } from "./Rule.js";

export class Grammar extends NonTerminal
{
    /**
     * @param {Rule[]} rules
     */
    constructor(rules)
    {
        super();
        this.rules = rules;
    }

    get children()
    {
        return this.rules;
    }
}