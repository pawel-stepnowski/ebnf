export { DomGenerator } from "./DomGenerator.js";
export { Array } from "./Array.js";
export { Object } from "./Object.js";
export { Regex } from "./Regex.js";
export { RegexString } from "./RegexString.js";
import { NonTerminal } from "../tree/NonTerminal.js";
import { Symbol } from "../tree/Symbol.js";
import { Terminal } from "../tree/Terminal.js";
export * as String from "./String.js";
/**
 * @param {Symbol} symbol 
 */
export function removeWhitespaces(symbol)
{
    if (symbol instanceof Terminal) symbol.gap = [];
    if (symbol instanceof NonTerminal) symbol.children.forEach(removeWhitespaces);
}