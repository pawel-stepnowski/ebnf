import { PageSection } from "./PageSection.js";

export class Page
{
    /**
     * @param {{ url: string }} param0 
     */
    section({ url: href })
    {
        const url = URL.parse(href);
        if (!url) return;
        const section_id = url.searchParams.get('section');
        if (!section_id) return;
        const section_element = document.getElementById(section_id);
        if (!section_element) return;
        const parent = section_element.parentElement;
        if (!parent) return;
        return new PageSection(parent);
    }
}