import { RegexString } from "./RegexString.js";

export class Regex
{
    /**
     * @param {string[][]} symbols 
     */
    static createAlternation(...symbols)
    {
        const all_symbols = symbols.reduce((acc, a) => acc.concat(a), []);
        if (all_symbols.every(symbol => symbol.length === 1))
            if (all_symbols.length == 1)
                return new Regex(all_symbols.map(Regex.escape).join(''));
            else
                return new Regex('[' + all_symbols.map(Regex.escapeClass).join('') + ']');
        else
            return new Regex('(' + all_symbols.map(Regex.escape).join('|') + ')');
    }

    /**
     * @param {string[][]} symbols 
     */
    static createAlternationOptional(...symbols)
    {
        return new Regex(RegexString.alternation(...symbols) + '*');
    }

    /**
     * @param {string} symbol 
     * @returns {string}
     */
    static escape(symbol)
    {
        return symbol.replaceAll(/[\.\*\+\?\^\$\{\}\(\)\|\[\]\\\-]/g, m => '\\' + m[0]);
    }

    /**
     * @param {string} symbol 
     * @returns {string}
     */
    static escapeClass(symbol)
    {
        return symbol.replaceAll(/[\[\]\-\\\^\$]/g, m => '\\' + m[0]);
    }

    /**
     * @param {string} pattern 
     */
    constructor(pattern)
    {
        this.pattern = pattern;
    }
}
