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
const allExpanded = 'allExpanded';
const allCollapsed = 'allCollapsed';
const searchString = 'searchString';
const sortDir = 'sortDir';
const init = ({ self }) => {
    self.allExpanded = false;
    self.allCollapsed = false;
    self.searchString = null;
    self.sortDir = null;
};
const actions = [
    ({ allExpanded, self }) => {
        if (allExpanded) {
            const t0 = performance.now();
            self.open = true;
            self.querySelectorAll('details').forEach(details => details.open = true);
            const t1 = performance.now();
            console.log(t1 - t0 + ' milliseconds');
        }
        self.allCollapsed = false;
    },
    ({ allCollapsed, self }) => {
        if (allCollapsed) {
            self.removeAttribute('open');
            self.querySelectorAll('details').forEach(details => details.removeAttribute('open'));
        }
        self.allExpanded = false;
    },
    ({ searchString, self }) => {
        const t0 = performance.now();
        if (searchString === null || searchString === '')
            return;
        self.allCollapsed = true;
        const newValLC = searchString.toLowerCase();
        const tNodes = Array.from(self.querySelectorAll('div, summary'));
        tNodes.forEach(el => {
            if (el.textContent.toLowerCase().indexOf(newValLC) > -1) {
                el.classList.add('match');
            }
            else {
                el.classList.remove('match');
            }
        });
        Array.from(self.querySelectorAll('details')).forEach(detailsEl => {
            if (detailsEl.querySelector('.match') !== null)
                detailsEl.open = true;
        });
        const firstMatch = self.querySelector('.match');
        if (firstMatch !== null) {
            self.open = true;
            firstMatch.scrollIntoView();
        }
        const t1 = performance.now();
        console.log(t1 - t0 + ' milliseconds');
    },
    ({ sortDir, self }) => {
        if (sortDir === null)
            return;
        const section = self.querySelector('section');
        const sectionChildren = Array.from(section.children);
        const one = sortDir === 'asc' ? 1 : -1;
        const minusOne = sortDir === 'asc' ? -1 : 1;
        sectionChildren.sort((a, b) => {
            const lhs = getStrVal(a);
            const rhs = getStrVal(b);
            if (lhs < rhs)
                return minusOne;
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
        // if(!h2._skipRecSort){
        //     h.querySelectorAll('details').forEach(details => {
        //         (<any>details)._skipRecSort = true;
        //         (<any>details).sortDir = newVal;
        //     });
        // }
    }
];
export class XtalTreeDeco extends XtalDeco {
    constructor() {
        super(...arguments);
        this.init = init; //TODO -- figure out how to de-any-fy
        this.actions = actions;
    }
}
XtalTreeDeco.is = 'xtal-tree-deco';
define(XtalTreeDeco);
