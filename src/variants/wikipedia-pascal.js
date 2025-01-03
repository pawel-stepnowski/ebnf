import { ISO_14977 } from "./index.js";
import { Regex, RegexString } from "../utilities/index.js";

export function createLexerPatterns()
{
    const patterns = ISO_14977.createLexerPatterns();
    patterns.identifier = new Regex(`${RegexString.alternation(ISO_14977.patterns.letter)}[^'"=,|()\\[\\]{}\\-.;]*`);
    return patterns;
}
    