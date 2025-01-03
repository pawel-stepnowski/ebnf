import { Regex } from "./Regex.js";

export class RegexString
{
    /**
     * @param {string[][]} symbols 
     */
    static alternation(...symbols)
    {
        const all = symbols.reduce((acc, a) => acc.concat(a), []);
        const single = all.filter(symbol => symbol.length === 1);
        const others = all.filter(symbol => symbol.length > 1);
        const classes = [];
        if (single.length === 1) classes.push(...single.map(Regex.escape));
        if (single.length > 1) classes.push('[' + single.map(Regex.escapeClass).join('') + ']');
        classes.push(...others.map(Regex.escape));
        if (classes.length > 1) return '(' + classes.join('|') + ')';
        return classes.join('|');
    }

    /**
     * @param {string[]} start
     * @param {string[]} end
     * @param {string} text 
     */
    static quote(start, end, text)
    {
        if (start.length !== 1) throw new Error();
        if (end.length !== 1) throw new Error();
        return `(?<start>${Regex.escape(start[0])})(?<text>${text})(?<end>${Regex.escape(end[0])})`;
    }
}