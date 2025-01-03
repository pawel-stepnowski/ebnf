export class PageSection
{
    /**
     * @param {Element | string} element 
     */
    constructor(element)
    {
        this.element = typeof element === 'string' ? document.getElementById(element) : element;
        if (!this.element) throw new Error();
    }

    get output()
    {
        if (!this.output_element)
        {
            this.output_element = document.createElement('div');
            this.element.appendChild(this.output_element);
        }
        return this.output_element;
    }
    
    /**
     * @param {Element} element
     */
    append(element)
    {
        element.classList.add('example-output');
        this.output.appendChild(element);
    }
    
    /**
     * @param {string} text 
     */
    appendPreformattedText(text)
    {
        const pre = document.createElement('pre');
        pre.classList.add('example-output');
        pre.textContent = text;
        this.output.appendChild(pre);
    }
}