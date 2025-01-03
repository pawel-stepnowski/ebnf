import * as Variants from "./variants/index.js";
import { Regex } from "./utilities/index.js";
import { ISO_14977 } from "./variants/index.js";

/** @typedef {import("./index").LexerTokenName} LexerTokenName */

export class LexerConfiguration
{
    static iso_14977 = new LexerConfiguration('ISO/IEC 14977:1996', ISO_14977.createLexerPatterns());
    static wikipedia_pascal = new LexerConfiguration('Wikipedia Pascal', Variants.Wikipedia_Pascal.createLexerPatterns());

    /**
     * @param {string} name 
     * @param {Record<LexerTokenName | 'comment_start', Regex>} patterns 
     */
    constructor(name, patterns)
    {
        this.name = name;
        this.patterns = patterns;
    }
}