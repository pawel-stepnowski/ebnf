import * as EBNF from '@liquescens/ebnf-types';

const grammar_text = 'rule = "a" | "b";';
const lexer_configuration = EBNF.LexerConfiguration.iso_14977;
const lexer = new EBNF.Lexer(grammar_text, lexer_configuration);
const grammar = new EBNF.Parser(lexer).parse();
