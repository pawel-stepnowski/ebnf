import * as EBNF from '@liquescens/ebnf-types';
import { Page } from './js/utilities/Page.js';

window.addEventListener('load', onWindowLoad);
window['page'] = new Page(); 

function onWindowLoad()
{
    const a = new EBNF.Parser();
    document.body.appendChild(Object.assign(document.createElement('div'), { textContent: 'aabc' }));
}
