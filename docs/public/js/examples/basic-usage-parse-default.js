import * as EBNF from '@liquescens/ebnf-types';

const grammar_text = 'rule = "a" | "b";';
const grammar = EBNF.parse(grammar_text);
