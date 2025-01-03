import * as EBNF from '@liquescens/ebnf-types';

const identifier_pattern = `[a-zA-Z][^'"=,|()\\[\\]{}\\-.;]*`;
const lexer_configuration = EBNF.LexerConfiguration.iso_14977();
lexer_configuration.patterns.identifier = { pattern: identifier_pattern };
const grammar_url = '/grammars/wikipedia/pascal-like.ebnf.txt';
const grammar_text = await (await fetch(grammar_url)).text();
const lexer = new EBNF.Lexer(grammar_text, lexer_configuration);
const grammar = new EBNF.Parser(lexer).parse();

const current_section = window.page.section(import.meta);
current_section?.append(new EBNF.Utilities.DomGenerator().generate(grammar));