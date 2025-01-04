export { DomGenerator } from "./DomGenerator.js";
export { Array } from "./Array.js";
export { Object } from "./Object.js";
export { Regex } from "./Regex.js";
export { RegexString } from "./RegexString.js";
import { Comment } from "../tree/Comment.js";
import { DefinitionList } from "../tree/DefinitionList.js";
import { Grammar, Identifier, Token } from "../tree/index.js";
import { NonTerminal } from "../tree/NonTerminal.js";
import { Rule } from "../tree/Rule.js";
import { Symbol } from "../tree/Symbol.js";
import { Terminal } from "../tree/Terminal.js";
export * as String from "./String.js";
/**
 * @param {Symbol} symbol 
 * @param {{ whitespaces?: boolean, comments?: boolean }} [options]
 */
export function removeGap(symbol, options)
{
    if (symbol instanceof Terminal) 
    {
        const whitespaces = options?.whitespaces ?? true;
        const comments = options?.comments ?? false;
        if (whitespaces && comments) symbol.gap = [];
        else if (whitespaces) symbol.gap = symbol.gap.filter(gap => typeof gap !== 'string');
        else if (comments) symbol.gap = symbol.gap.filter(gap => (gap instanceof Comment) === false);
    }
    if (symbol instanceof NonTerminal) symbol.children.forEach(child => removeGap(child, options));
}
/**
 * @param {Symbol} symbol
 */
export function format(symbol)
{
    if (symbol instanceof Rule) 
    {
        const avoid = symbol.parent instanceof Grammar && symbol.parent.rules[0] === symbol;
        if (!avoid) symbol.identifier.gap.push('\r\n');
    }
    if (symbol instanceof Terminal)
    {
        if (symbol.parent instanceof Rule && symbol.parent.identifier === symbol)
        {
            for (let i = symbol.gap.length - 1; i >= 0; i--)
            {
                if (symbol.gap[i] instanceof Comment) symbol.gap.splice(i + 1, 0, '\r\n');
            }
        }
        else
        {
            const avoid = symbol instanceof Token && symbol.name == 'definition_separator';
            if (!avoid) symbol.gap.push(' ');
        }
    }
    if (symbol instanceof DefinitionList && symbol.parent instanceof Rule) 
    {
        if (symbol.separators)
        {
            const identifier_length = symbol.parent.identifier.toString({ with_gap: false }).length;
            const operator_length = symbol.parent.operator.toString({ with_gap: true }).length;
            const indentation = identifier_length + operator_length - 1;
            const gap = '\r\n' + ' '.repeat(indentation);
            const definition_text = symbol.definitions[0].toString();
            if (definition_text.length > 8)
            {
                symbol.separators?.forEach(separator => separator.gap.push(gap));
            }
            else
            {
                let length = symbol.definitions[0].toString().length;
                for (let i = 0; i < symbol.separators.length; i++)
                {
                    if (length > 50)
                    {
                        symbol.separators[i].gap.push(gap);
                        length = 0;
                    }
                    else symbol.separators[i].gap.push(' ');
                    length += symbol.definitions[i].toString().length;
                }
            }
        }
    }
    if (symbol instanceof NonTerminal) symbol.children.forEach(format);
}