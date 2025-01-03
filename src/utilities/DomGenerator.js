import { Terminal } from "../tree/Terminal.js";
import { NonTerminal } from "../tree/NonTerminal.js";
import { Symbol } from "../tree/Symbol.js";
import { Comment } from "../tree/Comment.js";

export class DomGenerator
{
    /**
     * @param {Symbol | Comment | string} symbol 
     * @returns {Element}
     */
    generate(symbol)
    {
        if (typeof symbol === 'string')
        {
            return Object.assign(document.createElement('div'), { textContent: symbol });
        }
        if (symbol instanceof Comment)
        {
            const textContent = symbol.toString();
            const element = this._createNodeElement(symbol, { textContent });
            return element;
        }
        if (symbol instanceof Terminal)
        {
            const textContent = symbol.toString({ with_gap: false });
            const element = this._createNodeElement(symbol, { textContent });
            return element;
        }
        if (symbol instanceof NonTerminal)
        {
            const element = this._createNodeElement(symbol, {});
            symbol.children.forEach(child => this.generateNodes(child).forEach(child_element => element.appendChild(child_element)));
            return element;
        }
        throw new Error('TODO');
    }

    /**
     * @param {Symbol | string} symbol 
     * @returns {Element[]}
     */
    generateNodes(symbol)
    {
        if (typeof symbol === 'string') return [this.generate(symbol)];
        const gap_elements = symbol instanceof Terminal ? symbol.gap.map(gap => this.generate(gap)) : [];
        const element = this.generate(symbol);
        return [...gap_elements, element];
    }
    
    /**
     * @param {Symbol} symbol
     * @param {{ textContent?: string }} properties 
     * @returns 
     */
    _createNodeElement(symbol, { textContent })
    {
        const element = document.createElement('div');
        const class_name = symbol.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase();
        element.classList.add(class_name);
        if (textContent) element.textContent = textContent;
        return element;
    }

    /**
     * @param {Terminal} symbol 
     */
    _createGapElements(symbol)
    {
        return symbol.gap.map(node => node instanceof Node 
            ? Object.assign(document.createElement('div'), { textContent: 'comment' })
            : Object.assign(document.createElement('div'), { textContent: node })).flat();
    }
}
