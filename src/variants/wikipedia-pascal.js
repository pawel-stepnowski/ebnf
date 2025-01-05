import { ISO_14977 } from "./index.js";
import { Regex, RegexString } from "../utilities/index.js";

export function clonePatterns()
{
    const patterns = ISO_14977.clonePatterns();
    patterns.identifier = new Regex(`${RegexString.alternation(patterns.letter)}[^'"=,|()\\[\\]{}\\-.;]*`);
    return patterns;
}
    