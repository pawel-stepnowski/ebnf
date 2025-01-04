import * as Variants from "./variants/index.js";
import * as Tree from "./tree/index.js";
import * as Utilities from "./utilities/index.js";
import { Lexer } from "./Lexer.js";
import { LexerConfiguration } from "./LexerConfiguration.js";
import { Parser } from "./Parser.js";
export * as Tree from "./tree/index.js";
export * as Utilities from "./utilities/index.js";
export * as Variants from "./variants/index.js";
export { Lexer }
export { LexerConfiguration }
export { Parser }
export { SyntaxError } from "./SyntaxError.js";
/**
 * @param {string} grammar_text
 * @returns {Tree.Grammar}
 */
export function parse(grammar_text)
{
    const lexer = new Lexer(grammar_text, LexerConfiguration.iso_14977);
    const parser = new Parser(lexer);
    return parser.parse();
}
/**
 * @param {Tree.Grammar} grammar
 * @returns {Element}
 */
export function toDom(grammar)
{
    return new Utilities.DomGenerator().generate(grammar);
}
/**
 * @typedef LexerPosition
 * @property {number} offset
 * @property {number} line_number
 * @property {number} line_offset
 */
/**
 * @typedef LexerTokenTypeMap
 * @property {Tree.Comment} comment
 * @property {Tree.Identifier} identifier
 * @property {Tree.Integer} integer
 * @property {Tree.TerminalString} terminal_string
 * @property {Tree.SpecialSequence} special_sequence
 * @property {string} gap
 * @property {Tree.Token} defining
 * @property {Tree.Token} repetition_symbol
 * @property {Tree.Token} optional_sequence_start
 * @property {Tree.Token} optional_sequence_end
 * @property {Tree.Token} repeated_sequence_start
 * @property {Tree.Token} repeated_sequence_end
 * @property {Tree.Token} grouped_sequence_start
 * @property {Tree.Token} grouped_sequence_end
 * @property {Tree.Token} terminator
 * @property {Tree.Token} term_operator
 * @property {Tree.Token} concatenation_separator
 * @property {Tree.Token} definition_separator
 */
/**
 * @typedef {keyof LexerTokenTypeMap} LexerTokenName
 */
/**
 * @template {LexerTokenName} Name
 * @typedef LexerToken
 * @property {LexerPosition} position
 * @property {Name} name
 * @property {LexerTokenTypeMap[Name]} value
 */
/**
 * @template T
 * @template ValueType
 * @typedef {{ [K in keyof T]: T[K] extends ValueType ? K : never; }[keyof T]} KeysMatchingType
 */