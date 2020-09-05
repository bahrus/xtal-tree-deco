import { XtalDeco, propActions } from 'xtal-deco/xtal-deco.js';
import { define } from 'xtal-element/xtal-latx.js';
function getStrVal(el) {
    switch (el.localName) {
        case 'details':
            return el.querySelector('summary').textContent;
        default:
            return el.textContent;
    }
}
// interface ExtendedHTMLDetailsElement extends HTMLDetailsElement{
//     self: ExtendedHTMLDetailsElement;
// }
const init = ({ self }) => {
    self.allExpanded = false;
    self.allCollapsed = false;
    self.searchString = null;
    self.sortDir = null;
};
const actions = [
    ({ allExpanded, self }) => {
        if (!allExpanded)
            return;
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
        if (!allCollapsed)
            return;
        if (allCollapsed) {
            self.removeAttribute('open');
            self.querySelectorAll('details').forEach(details => details.removeAttribute('open'));
        }
        self.allExpanded = false;
    },
];
export const treePropActions = [...propActions, ({ self, allExpanded, mainProxy }) => {
        if (mainProxy === undefined)
            return;
        mainProxy.allExpanded = allExpanded;
    }
];
export class XtalTreeDeco extends XtalDeco {
    constructor() {
        super(...arguments);
        this.init = init; //TODO -- figure out how to de-any-fy
        this.actions = actions;
        this.virtualProps = ['allExpanded', 'allCollapsed'];
        this.propActions = treePropActions;
    }
}
XtalTreeDeco.is = 'xtal-tree-deco';
XtalTreeDeco.attributeProps = ({ allExpanded }) => ({
    bool: [allExpanded]
});
define(XtalTreeDeco);
