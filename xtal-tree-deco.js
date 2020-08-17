import { decorate, } from 'trans-render/plugins/decorate.js';
import { XtalDeco } from 'xtal-deco/xtal-deco.js';
import { define } from 'xtal-element/xtal-latx.js';
function getStrVal(el) {
    switch (el.localName) {
        // case 'div':
        //     return el.textContent;
        case 'details':
            return el.querySelector('summary').textContent;
        default:
            return el.textContent;
    }
}
export class XtalTreeDeco extends XtalDeco {
    constructor() {
        super();
        this.decoratorFn = (target) => {
            decorate(target, {
                propDefs: {
                    allExpanded: false,
                    allCollapsed: false,
                    searchString: null,
                    sortDir: null,
                },
                methods: {
                    onPropsChange(name, newVal) {
                        const h = this;
                        const h2 = h;
                        switch (name) {
                            case 'allExpanded':
                                if (newVal) {
                                    const t0 = performance.now();
                                    h.setAttribute('open', '');
                                    //const lock = this.getDisplayLock();
                                    //this.displayLock.acquire().then(() =>{
                                    h.querySelectorAll('details').forEach(details => details.setAttribute('open', ''));
                                    //lock.commit();
                                    //})
                                    const t1 = performance.now();
                                    console.log(t1 - t0 + ' milliseconds');
                                }
                                if (h2.allCollapsed)
                                    h2.allCollapsed = false;
                                break;
                            case 'allCollapsed':
                                if (newVal) {
                                    h.removeAttribute('open');
                                    h.querySelectorAll('details').forEach(details => details.removeAttribute('open'));
                                }
                                if (h2.allExpanded)
                                    h2.allExpanded = false;
                                break;
                            case 'searchString':
                                if (newVal === null || newVal === '')
                                    return;
                                const newValLC = newVal.toLowerCase();
                                h.querySelectorAll('section>div').forEach(div => {
                                    if (div.textContent.toLowerCase().indexOf(newValLC) > -1) {
                                        div.classList.add('match');
                                    }
                                    else {
                                        div.classList.remove('match');
                                    }
                                });
                                const summary = h.querySelector('summary');
                                if (summary.textContent.toLowerCase().indexOf(newValLC) > -1) {
                                    summary.classList.add('match');
                                    h2.allCollapsed = true;
                                }
                                else {
                                    summary.classList.remove('match');
                                    // if (recursive) {
                                    //     this.querySelectorAll('details').forEach(details => {
                                    //         details.searchString = newValLC;
                                    //     });
                                    //     if (this.querySelector('.match')) {
                                    //         this.setAttribute('open', '');
                                    //     }
                                    //     else {
                                    //         this.removeAttribute('open');
                                    //     }
                                    // }
                                }
                                break;
                            case 'sortDir':
                                if (newVal === null)
                                    return;
                                const section = this.querySelector('section');
                                const sectionChildren = Array.from(section.children);
                                const one = newVal === 'asc' ? 1 : -1;
                                const min = newVal === 'asc' ? -1 : 1;
                                sectionChildren.sort((a, b) => {
                                    const lhs = getStrVal(a);
                                    const rhs = getStrVal(b);
                                    if (lhs < rhs)
                                        return min;
                                    if (lhs > rhs)
                                        return one;
                                    return 0;
                                });
                                let count = 1;
                                sectionChildren.forEach(child => {
                                    const child2 = child;
                                    const count$ = count.toString();
                                    child2.style.order = count$;
                                    child2.tabIndex = parseInt(count$);
                                    count++;
                                });
                                //if (recursive) {
                                if (!h2._skipRecSort) {
                                    h.querySelectorAll('details').forEach(details => {
                                        details._skipRecSort = true;
                                        details.sortDir = newVal;
                                    });
                                }
                            //}
                        }
                    }
                }
            });
        };
    }
}
XtalTreeDeco.is = 'xtal-tree-deco';
define(XtalTreeDeco);
