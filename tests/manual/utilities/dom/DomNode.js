/**
 * @template {keyof HTMLElementTagNameMap} Tag
 * @template {Record<string, DomNode<any, any>>[]} Children
 */
export class DomNode
{
    /**
     * @param {Tag} tag_name 
     */
    constructor(tag_name)
    {
        /** @type {HTMLElementTagNameMap[Tag]} */
        this.element = document.createElement(tag_name);
    }

    /**
     * @param {Record<string, string>} values 
     */
    attributes(values)
    {
        for (const [name, value] of Object.entries(values))
            this.element.setAttribute(name, value);
        return this;
    }

    /**
     * @param {string} value
     */
    textContent(value)
    {
        this.element.textContent = value;
        return this;
    }

    /**
     * @template {Record<string, DomNode<any, any>>} Children
     * @param {Children} children 
     * @returns {DomNode<Tag, Children> & Children}
     */
    children(children)
    {
        const that = Object.assign(this, children);
        this.element.append(...Object.values(children).map(child => child.element));
        return that;
    }
}