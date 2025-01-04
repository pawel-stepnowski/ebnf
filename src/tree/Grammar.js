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
        this.rules.forEach(rule => rule.parent = this);
    }

    get children()
    {
        return this.rules;
    }
}