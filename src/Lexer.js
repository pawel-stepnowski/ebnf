import * as Utilities from "./utilities/index.js";
import { SyntaxError } from "./SyntaxError.js";
import { LexerConfiguration } from "./LexerConfiguration.js";
import { TerminalBrackets } from "./tree/TerminalBrackets.js";
import { TerminalString } from "./tree/TerminalString.js";
import { Identifier } from "./tree/Identifier.js";
import { Token } from "./tree/Token.js";
import { Comment } from "./tree/Comment.js";
import { Integer } from "./tree/Integer.js";
import { SpecialSequence } from "./tree/SpecialSequence.js";

/** @typedef {import("./index").LexerPosition} LexerPosition */
/** @typedef {import("./index").LexerTokenName} LexerTokenName */
/** @typedef {import("./index").LexerTokenTypeMap} LexerTokenTypeMap */
/** @template {LexerTokenName} T @typedef {import("./index").LexerToken<T>} LexerToken<T> */

const NewLine = /\n/g;

export class Lexer
{
    /**
     * @param {string} input 
     * @param {LexerConfiguration} configuration
     */
    constructor(input, configuration)
    {
        this.input = input;
        this.configuration = configuration;
        /** @type {LexerPosition} */
        this.position = 
        {
            offset: 0,
            line_number: 1,
            line_offset: 0,
        };
        this.patterns = Utilities.Object.mapProperties(this.configuration.patterns, item => new RegExp(item.pattern, 'y'));
        /** @type {LexerToken<LexerTokenName>[]} */
        this._tokens = [];
    }


    /**
     * @returns {LexerToken<LexerTokenName> | undefined}
     */
    top()
    {
        if (this._tokens.length === 0)
        {
            const token = this._read();
            if (token) this._tokens.push(token);
        }
        if (this._tokens.length > 0) return this._tokens[0];
    }

    /**
     * @returns {LexerToken<LexerTokenName> | undefined}
     */
    pop()
    {
        const token = this.top();
        if (token) this._tokens.shift();
        return token;
    }
    
    /**
     * @template {keyof LexerTokenTypeMap} TokenName
     * @param {TokenName} symbol_name
     * @returns {LexerToken<TokenName>}
     */
    popMandatory(symbol_name)
    {
        document.querySelector
        const token = this.pop();
        if (!token)
            throw this.createException(`Unrecognized token at ({line_position}). Token "${symbol_name}" was expected.`, this.position);
        if (symbol_name.indexOf(token.name) === -1)
            throw this.createException(`Unexpected token at ({line_position}). Token "${token.name}" was received, but "${symbol_name}" was expected.`, this.position);
        // @ts-ignore
        return token;
    }

    /**
     * @param  {...import("./index").LexerToken<LexerTokenName>} tokens 
     */
    undo(...tokens)
    {
        this._tokens.unshift(...tokens);
    }

    /**
     * @returns {import("./index").LexerToken<LexerTokenName> | undefined}
     */
    _read()
    {
        return this._readComment() 
            || this._readTerminalString()
            || this._readSpecialSequence()
            || this._readObject('integer', match => new Integer(parseInt(match)))
            || this._readObject('identifier', match => new Identifier(match))
            || this._readObject('term_operator', match => new Token(match))
            || this._readObject('definition_separator', match => new Token(match))
            || this._readObject('concatenation_separator', match => new Token(match))
            || this._readObject('defining', match => new Token(match))
            || this._readObject('terminator', match => new Token(match))
            || this._readObject('repetition_symbol', match => new Token(match))
            || this._readObject('repeated_sequence_start', match => new Token(match))
            || this._readObject('repeated_sequence_end', match => new Token(match))
            || this._readObject('grouped_sequence_start', match => new Token(match))
            || this._readObject('grouped_sequence_end', match => new Token(match))
            || this._readObject('optional_sequence_start', match => new Token(match))
            || this._readObject('optional_sequence_end', match => new Token(match))
            || this._readObject('gap', match => match);
    }

    /**
     * @returns {LexerToken<'comment'> | undefined}
     */
    _readComment()
    {
        const position = { ...this.position };
        const match = this._match('comment_start');
        if (!match) return;
        this._updatePosition(match[0]);
        const start = match[0];
        const value = [];
        let comment_nesting = 1;
        while (true)
        {
            const match = this._match('comment', { text: 'text', end: 'end' });
            if (!match) throw new Error('TODO');
            this._updatePosition(match[0]);
            value.push(match.text);
            if (start === match.end) comment_nesting++;
            else comment_nesting--;
            if (comment_nesting === 0)
            {
                const comment = new Comment(value.join(''), new TerminalBrackets(start, match.end));
                return { position, name: 'comment', value: comment }; 
            }
            value.push(match.end);
        }
    }

    /**
     * @returns {LexerToken<'terminal_string'> | undefined}
     */
    _readTerminalString()
    {
        const position = { ...this.position };
        const match = this._match('terminal_string', { text: 'text', start: 'start', end: 'end' });
        if (!match) return;
        const value = new TerminalString(match.text, new TerminalBrackets(match.start, match.end));
        this._updatePosition(match[0]);
        return { position, name: 'terminal_string', value };
    }

    /**
     * @returns {LexerToken<'special_sequence'> | undefined}
     */
    _readSpecialSequence()
    {
        const position = { ...this.position };
        const match = this._match('special_sequence', { text: 'text', start: 'start', end: 'end' });
        if (!match) return;
        const value = new SpecialSequence(match.text, new TerminalBrackets(match.start, match.end));
        this._updatePosition(match[0]);
        return { position, name: 'special_sequence', value };
    }

    /**
     * @template {LexerTokenName} TokenName
     * @param {TokenName} token_name 
     * @param {(match: string) => LexerTokenTypeMap[TokenName]} factory 
     * @returns {LexerToken<TokenName> | undefined}
     */
    _readObject(token_name, factory)
    {
        const position = { ...this.position };
        const match = this._match(token_name);
        if (!match) return;
        const value = factory(match[0]);
        this._updatePosition(match[0]);
        return { position, name: token_name, value }; 
    }
    
    /**
     * @template {Record<string, string>} Groups
     * @param {LexerTokenName | 'comment_start'} symbol_name 
     * @param {Groups} [required_groups]
     * @returns {(RegExpExecArray & { [P in keyof Groups]: string }) | undefined}
     */
    _match(symbol_name, required_groups)
    {
        const pattern = this.patterns[symbol_name];
        pattern.lastIndex = this.position.offset;
        
        const match = pattern.exec(this.input);
        if (!match) return;
        /** @type {any} */
        const properties = {};
        if (required_groups)
        {
            if (!match.groups) throw new Error(`Pattern for token "${symbol_name}" must have a groups ${Object.values(required_groups).map(g => `"${g}"`).join(', ')}.`);
            for (const [property, group] of Object.entries(required_groups))
            {
                if (!Object.hasOwn(match.groups ?? {}, group)) throw new Error(`Pattern for token "${symbol_name}" must have a group name "${group}".`);
                properties[property] = match.groups[group];
            }
        }
        Object.assign(match, properties);
        // @ts-ignore
        return match;
    }

    /**
     * @param {string} message 
     * @param {LexerPosition} position 
     */
    createException(message, position)
    {
        const line_position = `${position.line_number}:${position.offset - position.line_offset}`;
        const line_text = this.input.substring(position.line_offset, position.offset + 1);
        message = message.replaceAll('{line_position}', line_position);
        throw new SyntaxError(message, position, line_text);
    }

    /**
     * @param {string} parsed_text 
     */
    _updatePosition(parsed_text)
    {
        let i = -1, match;
        while (match = NewLine.exec(parsed_text))
        {
            this.position.line_number++;
            i = match.index;
        }
        if (i !== -1) this.position.line_offset = this.position.offset + i + 1;
        this.position.offset += parsed_text.length;
    }
}
