import { DomGenerator } from "@liquescens/ebnf-types/utilities/DomGenerator.js";
import { parse } from "./basic-usage-parse.js";

const grammar_text = `digit = "0" | "1";
number = digit, { digit };
sum = number, "+", number;
mul = sum, "*", sum;`;
const grammar = parse(grammar_text);

const current_section = window.page.section(import.meta);
current_section?.append(new DomGenerator().generate(grammar));
current_section?.appendPreformattedText(grammar.toString());