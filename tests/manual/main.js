import { Lexer } from "../../src/Lexer.js";
import { LexerConfiguration } from "../../src/LexerConfiguration.js";
import { Parser } from "../../src/Parser.js";
import { dom } from "./utilities/dom/index.js";
import * as EBNF from "../../src/index.js";

window.addEventListener('load', onWindowLoad);

/**
 * @param {Parser} parser 
 */
function testGrammarParser(parser)
{
    const node = dom('div').attributes({ class: 'grammar-render-test' }).children
    ({
        raw_label: dom('h3').textContent('Raw string'),
        raw: dom('div').attributes({ class: 'grammar-raw' }),
        string_label: dom('h3').textContent('Parsed and converted to string'),
        string: dom('div').attributes({ class: 'grammar-string' }),
        html_label: dom('h3').textContent('Parsed and converted to html'),
        html: dom('div').attributes({ class: 'grammar-html' }),
        minified_label: dom('h3').textContent('Minified'),
        minified: dom('div').attributes({ class: 'grammar-string-minified' }),
        formatted_label: dom('h3').textContent('Minified, formatted and converted to html'),
        formatted: dom('div').attributes({ class: 'grammar-html' }),
    });
    node.raw.textContent(parser.lexer.input);
    try
    {
        
        const grammar = parser.parse();
        node.string.textContent(grammar.toString());
        node.html.element.appendChild(EBNF.toDom(grammar));
        EBNF.Utilities.removeGap(grammar);
        node.minified.textContent(grammar.toString());
        EBNF.Utilities.format(grammar);
        node.formatted.element.appendChild(EBNF.toDom(grammar));
    }
    catch (e)
    {
        node.string.textContent(e?.toString() ?? '');
        console.error(e);
    }
    document.body.appendChild(node.element);
}

/**
 * @param {string} grammar_url 
 * @param {(grammar_text: string) => Parser} parser_factory
 */
async function testGrammarFromUrl(grammar_url, parser_factory)
{
    const grammar_text = await (await fetch(grammar_url)).text();
    testGrammarParser(parser_factory(grammar_text));
}

async function onWindowLoad()
{
    const iso_14977_configuration = LexerConfiguration.iso_14977;
    const iso_14977_parser = (/** @type {string} */ grammar_text) => new Parser(new Lexer(grammar_text, iso_14977_configuration));
    await testGrammarFromUrl('../../docs/public/grammars/iso-iec-14977-1996/simplest_arithmetic.ebnf.txt', iso_14977_parser);
    await testGrammarFromUrl('../../docs/public/grammars/iso-iec-14977-1996/positive-tests-1.ebnf.txt', iso_14977_parser);
    await testGrammarFromUrl('../../docs/public/grammars/iso-iec-14977-1996/ebnf-from-wikipedia-corrected.ebnf.txt', iso_14977_parser);

    // const bnf_parser = (/** @type {string} */ grammar_text) => new BNFParser(new Lexer(grammar_text, BNFParser.lexerConfiguration()));
    // await testGrammarFromUrl('../../docs/public/grammars/wikipedia/postal-address.bnf.txt', bnf_parser);
  


    // debugger;
    // LexerConfiguration.wikipedia_pascal();

    // const grammar_text_trimmed = grammar_text.split('\n').map(line => line.trim()).filter(i => i).join('\r\n');
    // const grammar = new Parser(new Lexer(grammar_text_trimmed, new LexerConfiguration())).parse();
    // // const source = new ParserGenerator(grammar).generate();
    // document.body.appendChild(grammar.toHTML());
}