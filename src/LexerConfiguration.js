import { Variants } from "./index.js";
import { Regex } from "./utilities/index.js";

/** @typedef {import("./index.js").LexerTokenName} LexerTokenName */

export class LexerConfiguration
{
    static iso_14977 = new LexerConfiguration('ISO/IEC 14977:1996', Variants.ISO_14977.clonePatterns());
    static wikipedia_pascal = new LexerConfiguration('Wikipedia Pascal', Variants.Wikipedia_Pascal.clonePatterns());

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