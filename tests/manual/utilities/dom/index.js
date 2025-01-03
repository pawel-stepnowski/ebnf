import { DomNode } from "./DomNode.js";
export { DomNode } from "./DomNode.js";

/**
 * @param {string} id 
 * @returns {HTMLTemplateElement}
 */
export function queryTemplate(id)
{
    const template = document.getElementById(id);
    if (template?.tagName != 'TEMPLATE') throw new Error();
    // @ts-ignore
    return template;
}

/**
 * @param {string} id 
 * @returns {DocumentFragment}
 */
export function cloneTemplateById(id)
{
    return cloneTemplate(queryTemplate(id));
}

/**
 * @param {HTMLTemplateElement} template 
 * @returns {DocumentFragment}
 */
export function cloneTemplate(template)
{
    const fragment = template.content.cloneNode(true);
    // @ts-ignore
    return fragment;
}

/**
 * @param {ParentNode} container
 * @param {string} selector
 * @returns {Element}
 */
export function querySelectorMandatory(container, selector)
{
    const element = container.querySelector(selector);
    if (!element) throw new Error();
    return element;
}

/**
 * @template {Record<string, string>} T
 * @param {ParentNode} element 
 * @param {T} selectors 
 * @returns {{[P in keyof T]: Element}}
 */
export function querySelectors(element, selectors)
{
    const entries = Object.entries(selectors).map(([key, selector]) => [key, querySelectorMandatory(element, selector)]);
    return Object.fromEntries(entries);
}

/**
 * @template {keyof HTMLElementTagNameMap} Tag
 * @param {Tag} tag_name
 * @returns {DomNode<Tag, {}>}
 */
export function dom(tag_name)
{
    return new DomNode(tag_name);
}