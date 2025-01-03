import { Comment } from "./Comment.js";
import { Symbol } from "./Symbol.js";

export class Terminal extends Symbol
{
    constructor()
    {
        super();
        /** @type {(string | Comment)[]} */
        this.gap = [];
    }
    
    /**
     * @param {{ with_gap?: boolean }} [options]
     */
    toString(options)
    {
        const with_gap = options?.with_gap ?? true;
        return with_gap ? this.gap.map(gap => gap instanceof Comment ? gap.toString() : gap).join('') : '';
    }
}
