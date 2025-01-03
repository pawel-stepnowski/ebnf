import * as EBNF from '@liquescens/ebnf-types';

class BNFParser extends EBNF.Parser
{
    static lexerConfiguration()
    {
        const configuration = EBNF.LexerConfiguration.iso_14977();
        configuration.patterns.identifier = { pattern: `<[^>]+>` };
        configuration.patterns.identifier_beginning = { pattern: `<` };
        configuration.patterns.defining = { pattern: '::=' };
        const characters_1 = '[a-zA-Z0-9,=|/!)\\]}\\-\"*?(\\[{;. :+_%@&#\\$<>\\\\\\^`~]|\\*\\)|/\\)|:\\)|\\(/|\\(:';
        const characters_2 = '[a-zA-Z0-9,=|/!)\\]}\\-\'*?(\\[{;. :+_%@&#\\$<>\\\\\\^`~]|\\*\\)|/\\)|:\\)|\\(/|\\(:';
        const pattern_1 = `(?<start>\')(?<text>(${characters_1})*)(?<end>\')`;
        const pattern_2 = `(?<start>\")(?<text>(${characters_2})*)(?<end>\")`;
        configuration.patterns.terminal_string = { pattern: `${pattern_1}|${pattern_2}` };
        return configuration;
    }

    /** @override */
    _parseDefinition()
    {
        const { items: definitions } = this._parseList(() => this._parseTerm());
        return new EBNF.Tree.Definition(definitions);
    }

    /**
     * @override
     * @template {EBNF.KeysMatchingType<EBNF.LexerTokenTypeMap, EBNF.Tree.Token | EBNF.Tree.Integer>} T
     * @param {T} symbol_name
     * @returns {EBNF.LexerTokenTypeMap[T]}
     */
    _parseTerminal(symbol_name)
    {
        if (symbol_name === 'terminator')
        {
            const gap = this._parseGap();
            const terminator = new EBNF.Tree.Token('');
            terminator.gap.push(...gap.map(item => item.value));
            return terminator;
        }
        return super._parseTerminal(symbol_name);
    }
    
    /**
     * @template {EBNF.Tree.Factor | EBNF.Tree.Identifier | EBNF.Tree.BracketedSequence | EBNF.Tree.SpecialSequence | EBNF.Tree.InfixTerm} T
     * @param {() => T} parseItem 
     * @returns {{ items: T[] }}
     */
    _parseList(parseItem)
    {
        const item = parseItem();
        const items = [item];
        while (true)
        {
            if (this._isListTerminator()) break;
            const item = parseItem();
            items.push(item);
        }
        return { items };
    }

    _isListTerminator()
    {
        const token_1_gap = this._parseGap();
        const token_1 = this.lexer.pop();
        if (!token_1) return true;
        const result = token_1.name === 'terminator' || token_1.name === 'definition_separator' ? true 
            : token_1.name !== 'identifier' ? false : undefined;
        if (result !== undefined)
        {
            this.lexer.undo(...token_1_gap, token_1);
            return result;
        }
        const token_2_gap = this._parseGap();
        const token_2 = this.lexer.top();
        this.lexer.undo(...token_1_gap, token_1, ...token_2_gap);
        return token_2?.name === 'defining';
    }
}

try
{
    const grammar_text = await (await fetch('/grammars/wikipedia/postal-address.bnf.txt')).text();
    const lexer = new EBNF.Lexer(grammar_text, BNFParser.lexerConfiguration());
    const grammar = new BNFParser(lexer).parse();
    
    window.page.section(import.meta)?.append(new EBNF.Utilities.DomGenerator().generate(grammar));
    window.page.section(import.meta)?.append(Object.assign(document.createElement('div'), { style: 'white-space: pre;', textContent: grammar.toString() }));
}
catch (e)
{
    window.page.section(import.meta)?.append(Object.assign(document.createElement('div'), { style: 'white-space: pre;', textContent: e?.toString() }));
}
