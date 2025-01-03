import { Terminal } from "./Terminal.js";

export class Integer extends Terminal
{
    /**
     * @param {number} value
     */
    constructor(value)
    {
        super();
        this.value = value;
    }
 
    /**
     * @param {{ with_gap?: boolean }} [options]
     */
    toString(options)
    {
        return super.toString(options) + this.value.toString();
    }
}