import { DefinitionList, Factor } from "./tree/index.js";
import { Definition } from "./tree/index.js";
import { Grammar } from "./tree/index.js";
import { Identifier } from "./tree/index.js";
import { Rule } from "./tree/index.js";
import { BracketedSequence } from "./tree/index.js";
import { Lexer } from "./Lexer.js";
import { InfixTerm } from "./tree/index.js";
import { SpecialSequence } from "./tree/index.js";
import { Token } from "./tree/index.js";
import { Brackets } from "./tree/Brackets.js";
import { Symbol } from "./tree/Symbol.js";
import { TerminalString } from "./tree/TerminalString.js";
import { Integer } from "./tree/Integer.js";

/** @typedef {import("./index").LexerPosition} LexerPosition */
/** @typedef {import("./index").LexerTokenName} LexerTokenName */
/** @typedef {import("./index").LexerTokenTypeMap} LexerTokenTypeMap */
/** @template {LexerTokenName} T @typedef {import("./index").LexerToken<T>} LexerToken */
/** @template T @template V @typedef {import("./index").KeysMatchingType<T, V>} KeysMatchingType */

export class Parser
{
    /**
     * @param {Lexer} lexer 
     */
    constructor(lexer)
    {
        this.lexer = lexer;
    }
    
    parse()
    {
        const rules = [];
        while (this.lexer.top()) rules.push(this._parseRule());
        return new Grammar(rules);
    }
    
    _parseRule()
    {
        const identifier = this._parseTerminal('identifier');
        const defining = this._parseTerminal('defining');
        const definitions = this._parseDefinitionList();
        const terminator = this._parseTerminal('terminator');
        const rule = new Rule(identifier, definitions, defining, terminator);
        return rule;
    }

    _parseDefinitionList()
    {
        const { items: definitions, separators } = this._parseSeparatedList(() => this._parseDefinition(), 'definition_separator');
        return new DefinitionList(definitions, separators);
    }

    _parseDefinition()
    {
        const { items: terms, separators } = this._parseSeparatedList(() => this._parseTerm(), 'concatenation_separator');
        return new Definition(terms, separators);
    }
    
    /**
     * @template {Symbol} T
     * @param {() => T} parseItem 
     * @param {KeysMatchingType<LexerTokenTypeMap, Token>} separator_symbol_name 
     * @returns {{ items: T[], separators: Token[]}}
     */
    _parseSeparatedList(parseItem, separator_symbol_name)
    {
        const item = parseItem();
        const items = [item];
        const separators = [];
        let separator_gap = this._parseGap();
        while (this.lexer.top()?.name === separator_symbol_name)
        {
            const separator = this.lexer.popMandatory(separator_symbol_name);
            separator.value.gap.push(...separator_gap.map(item => item.value));
            separators.push(separator.value);
            const item = parseItem();
            items.push(item);
            separator_gap = this._parseGap();
        }
        this.lexer.undo(...separator_gap);
        return { items, separators };
    }

    /**
     * @returns {Factor | Identifier | BracketedSequence | SpecialSequence | InfixTerm}
     */
    _parseTerm()
    {
        const factor = this._parseFactor();
        const operator_gap = this._parseGap();
        if (this.lexer.top()?.name === 'term_operator')
        {
            const operator = this.lexer.popMandatory('term_operator');
            operator.value.gap.push(...operator_gap.map(item => item.value));
            const second_factor = this._parseFactor();
            return new InfixTerm(factor, second_factor, operator.value);
        }
        else
        {
            this.lexer.undo(...operator_gap);
            return factor;
        }
    }

    _parseFactor()
    {
        const gap = this._parseGap();
        if (this.lexer.top()?.name === 'integer')
        {
            this.lexer.undo(...gap);
            const repetition = this._parseTerminal('integer');
            const operator = this._parseTerminal('repetition_symbol');
            const primary = this._parsePrimary();
            return new Factor(primary, repetition, operator);
        }
        else 
        {
            this.lexer.undo(...gap);
            return this._parsePrimary();
        }
    }

    /**
     * @param {KeysMatchingType<LexerTokenTypeMap, Token>} opening_bracket_pattern_name 
     * @param {KeysMatchingType<LexerTokenTypeMap, Token>} closing_bracket_pattern_name
     */
    _parseBracketedSequence(opening_bracket_pattern_name, closing_bracket_pattern_name)
    {
        const opening_bracket = this._parseTerminal(opening_bracket_pattern_name);
        const definitions = this._parseDefinitionList();
        const closing_bracket = this._parseTerminal(closing_bracket_pattern_name);
        const brackets = new Brackets(opening_bracket, closing_bracket);
        const sequence = new BracketedSequence(definitions, brackets);
        return sequence;
    }

    /**
     * @template {KeysMatchingType<LexerTokenTypeMap, Token | Integer>} T
     * @param {T} symbol_name 
     * @returns {LexerTokenTypeMap[T]}
     */
    _parseTerminal(symbol_name)
    {
        // skoro wszystkim terminalom parsuję gap, to czy nie może tego robić lekser?
        const gap = this._parseGap();
        const symbol = this.lexer.popMandatory(symbol_name);
        if (gap) symbol.value.gap.push(...gap.map(item => item.value));
        return symbol.value;
    }

    /**
     * @returns {TerminalString | Identifier | BracketedSequence}
     */
    _parsePrimary()
    {
        const gap = this._parseGap();
        const token = this.lexer.top();
        if (!token) throw this.lexer.createException(`Unexpected empty token at ({line_position}). TODO`, this.lexer.position);
        switch (token.name)
        {
            case 'repeated_sequence_start':
                this.lexer.undo(...gap);
                return this._parseBracketedSequence('repeated_sequence_start', 'repeated_sequence_end');
            case 'grouped_sequence_start':
                this.lexer.undo(...gap);
                return this._parseBracketedSequence('grouped_sequence_start', 'grouped_sequence_end');
            case 'optional_sequence_start':
                this.lexer.undo(...gap);
                return this._parseBracketedSequence('optional_sequence_start', 'optional_sequence_end');
            case 'identifier':
            case 'terminal_string':
            case 'special_sequence':
                const terminal_token = this.lexer.popMandatory(token.name);
                if (gap) terminal_token.value.gap.push(...gap.map(item => item.value));
                return terminal_token.value;
            default:
                throw this.lexer.createException(`Unexpected token "${token.name}" at ({line_position}).`, this.lexer.position);
        }
    }

    /**
     * @returns {(LexerToken<'gap'> | LexerToken<'comment'>)[]}
     */
    _parseGap()
    {
        const result = [];
        if (this.lexer.top()?.name == 'gap') result.push(this.lexer.popMandatory('gap'));
        while (this.lexer.top()?.name === 'comment')
        {
            result.push(this.lexer.popMandatory('comment'));
            if (this.lexer.top()?.name == 'gap') result.push(this.lexer.popMandatory('gap'));
        }
        return result;
    }
}
