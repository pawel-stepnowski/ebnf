import { Terminal } from "./Terminal.js";

export class Token extends Terminal
{
    /**
     * @param {string} value
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
        return super.toString(options) + this.value;
    }
}