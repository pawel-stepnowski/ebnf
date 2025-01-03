import { Regex, RegexString } from "../utilities/index.js";
import { concat } from "../utilities/String.js";

// [ISO IEC 14977] 7.2
const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// [ISO IEC 14977] 7.2
const decimal_digit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// [ISO IEC 14977]
// The representation of the following terminal-characters is defined in clauses 7.3, 7.4 and tables 1, 2.
const concatenate_symbol = [','];
const defining_symbol = ['='];
const definition_separator_symbol = ['|', '/', '!'];
const end_comment_symbol = ['*)'];
const end_group_symbol = [')'];
const end_option_symbol = [']', '/)'];
const end_repeat_symbol = ['}', ':)'];
const except_symbol = ['-'];
const first_quote_symbol = ["'"];
const second_quote_symbol = ['"'];
const repetition_symbol = ['*'];
const special_sequence_symbol = ['?']; 
const start_comment_symbol = ['(*']; 
const start_group_symbol = ['(']; 
const start_option_symbol = ['[', '(/']; 
const start_repeat_symbol = ['{', '(:']; 
const terminator_symbol = [';', '.'];
// 7.5
const other_character = [' ', ':', '+', '_', '%', '@', '&', '#', '$', '<', '>', '\\', '^', '`', '~'];
// 7.6
const space_character = [' '];
const horizontal_tabulation_character = ['\t'];
const new_line = ['\r', '\n']; // TODO
const vertical_tabulation_character = ['\v'];
const form_feed = ['\f'];

// [ISO IEC 14977] 6.2
const terminal_character = concat(
    letter,
    decimal_digit,
    concatenate_symbol,
    defining_symbol,
    definition_separator_symbol,
    end_comment_symbol,
    end_group_symbol,
    end_option_symbol,
    end_repeat_symbol,
    except_symbol,
    first_quote_symbol,
    repetition_symbol,
    second_quote_symbol,
    special_sequence_symbol,
    // start_comment_symbol,
    start_group_symbol,
    start_option_symbol,
    start_repeat_symbol,
    terminator_symbol,
    other_character);

// 4.9
const integer = new Regex(`${RegexString.alternation(decimal_digit)}${RegexString.alternation(decimal_digit)}*`);

// [ISO IEC 14977] 4.15
// A meta-identifier-character is a letter or a decimal-digit.
const meta_identifier_character = concat(letter, decimal_digit);
// [ISO IEC 14977] 4.14
// A meta-identifier consists of an ordered list of one or more meta-identifier-characters 
// subject to the condition that the first meta-identifier-character is a letter.

const meta_identifier = new Regex(`${RegexString.alternation(letter)}${RegexString.alternation(meta_identifier_character)}*`);
const meta_identifier_beginning = Regex.createAlternation(letter);
// 4.20
const special_sequence_character = terminal_character.filter(symbol => special_sequence_symbol.indexOf(symbol) < 0);
// 4.19
const special_sequence_text = RegexString.alternation(special_sequence_character) + "*";
const special_sequence = new Regex(RegexString.quote(special_sequence_symbol, special_sequence_symbol, special_sequence_text));

// [ISO IEC 14977] 4.17
// A first-terminal-character is any terminal-character except a first-quote-symbol.
const first_terminal_character = terminal_character.filter(symbol => first_quote_symbol.indexOf(symbol) < 0);
// [ISO IEC 14977] 4.18
// 
const second_terminal_character = terminal_character.filter(symbol => second_quote_symbol.indexOf(symbol) < 0);
// 6.4
const gap_separator = concat(space_character, horizontal_tabulation_character, new_line, vertical_tabulation_character, form_feed);
// 6.7
const comment_symbol = '.';  // TODO
// 6.8
const bracketed_textual_comment_text = '.*?(\*\)|\(\*)';

const start = RegexString.alternation(start_comment_symbol);
const text = comment_symbol + "*?";
const end = RegexString.alternation(start_comment_symbol, end_comment_symbol);

const bracketed_textual_comment = new Regex(`(?<start>)(?<text>${text})(?<end>${end})`);
const bracketed_textual_comment_beginning = Regex.createAlternation(start_comment_symbol);

// [ISO IEC 14977] 4.16
// A terminal-string consists of either: 
// a) A first-quote-symbol followed by a sequence of one or more first-terminal-characters followed by a first-quote-symbol, or 
// b) A second-quote-symbol, followed by a sequence of one or more second-terminal-characters followed by a second-quote-symbol.
// const first_terminal_string = ;
// const first_terminal_string = `(?<enclosure>${second_quote_symbol})(?<characters>[${escapeRegExp(first_terminal_characters.join(''))}]+)${second_quote_symbol}`;

const terminal_string_a = RegexString.quote(first_quote_symbol, first_quote_symbol, RegexString.alternation(first_terminal_character) + "+");
const terminal_string_b = RegexString.quote(second_quote_symbol, second_quote_symbol, RegexString.alternation(second_terminal_character) + "+");
const terminal_string = new Regex(`${terminal_string_a}|${terminal_string_b}`);

// /(?<enclosure>")(?<characters>[^"]+)"|(?<enclosure>')(?<characters>[^']+)'/y;

// -----

export const patterns =
{
    letter,
    decimal_digit,
    concatenate_symbol,
    defining_symbol,
    definition_separator_symbol,
    end_comment_symbol,
    end_group_symbol,
    end_option_symbol,
    end_repeat_symbol,
    except_symbol,
    bracketed_textual_comment,
    bracketed_textual_comment_beginning,
    repetition_symbol,
    integer,

    special_sequence_symbol,

    meta_identifier,
    meta_identifier_beginning,
    special_sequence,
    gap_separator,

    first_quote_symbol,
    second_quote_symbol,
    terminator_symbol,
    start_group_symbol,
    start_option_symbol,
    start_repeat_symbol,
    start_comment_symbol,
    terminal_string,
};

export function createLexerPatterns()
{
    const terminal_string_beginning = Regex.createAlternation(first_quote_symbol, second_quote_symbol);
    const special_sequence_beginning = Regex.createAlternation(special_sequence_symbol);
    const definition_separator = Regex.createAlternation(definition_separator_symbol);
    const concatenation_separator = Regex.createAlternation(concatenate_symbol);
    const gap = new Regex(`${RegexString.alternation(gap_separator)}+`);
    const defining = Regex.createAlternation(defining_symbol);
    const terminator = Regex.createAlternation(terminator_symbol);
    const term_operator = Regex.createAlternation(except_symbol);
    const bracketed_sequence_beginning = Regex.createAlternation(start_group_symbol, start_option_symbol, start_repeat_symbol);
    const optional_sequence_beginning = Regex.createAlternation(start_option_symbol);
    const optional_sequence_start = Regex.createAlternation(start_option_symbol);
    const optional_sequence_end = Regex.createAlternation(end_option_symbol);
    const repeated_sequence_beginning = Regex.createAlternation(start_repeat_symbol);
    const repeated_sequence_start = Regex.createAlternation(start_repeat_symbol);
    const repeated_sequence_end = Regex.createAlternation(end_repeat_symbol);
    const grouped_sequence_beginning = Regex.createAlternation(start_group_symbol);
    const grouped_sequence_start = Regex.createAlternation(start_group_symbol);
    const grouped_sequence_end = Regex.createAlternation(end_group_symbol);
    const comment_start = Regex.createAlternation(start_comment_symbol); 
    const comment = bracketed_textual_comment;
    const patterns =
    {
        terminator,
        terminal_string: terminal_string,
        terminal_string_beginning,
        special_sequence: special_sequence,
        special_sequence_beginning,
        identifier: meta_identifier,
        identifier_beginning: meta_identifier_beginning,
        gap,
        concatenation_separator,
        defining,
        definition_separator,
        bracketed_sequence_beginning,
        term_operator,
        optional_sequence_beginning, 
        repeated_sequence_beginning, 
        repeated_sequence_start,
        repeated_sequence_end,
        grouped_sequence_beginning, 
        grouped_sequence_start,
        grouped_sequence_end,
        optional_sequence_start, 
        optional_sequence_end,
        comment_start, 
        comment,
        repetition_symbol: Regex.createAlternation(repetition_symbol),
        integer: integer
    };
    return patterns;
}