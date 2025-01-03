import * as EBNF from '@liquescens/ebnf-types';

const grammar_url = '/grammars/iso-iec-14977-1996/ebnf-from-wikipedia-corrected.ebnf.txt';
const grammar_text = await (await fetch(grammar_url)).text();
const grammar = EBNF.parse(grammar_text);
EBNF.Utilities.removeWhitespaces(grammar);
const grammar_as_dom = EBNF.toDom(grammar);
const grammar_as_text = grammar.toString();

const current_section = window.page.section(import.meta);
current_section?.append(grammar_as_dom);
current_section?.appendPreformattedText(grammar_as_text);