import { Symbol } from "./Symbol.js";

export class NonTerminal extends Symbol
{
    /**
     * @return {Symbol[]}
     */
    get children()
    {
        throw new Error('Not implemented');
    }

    toString()
    {
        return this.children.join('');
    }
}
