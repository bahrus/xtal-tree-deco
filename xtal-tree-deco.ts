import {decorate, } from 'trans-render/plugins/decorate.js';
import {XtalDeco, propActions } from 'xtal-deco/xtal-deco.js';
import { DecorateArgs } from 'trans-render/types.d.js';
import {define, PropAction, AttributeProps} from 'xtal-element/xtal-latx.js';
function getStrVal(el: HTMLElement) : string {
    switch (el.localName) {
        case 'details':
            return el.querySelector('summary')!.textContent as string;
        default:
            return el.textContent as string;
    }
}


// interface ExtendedHTMLDetailsElement extends HTMLDetailsElement{

//     self: ExtendedHTMLDetailsElement;
// }

const init = ({self}: any) => {
    self.allExpanded = false;
    self.allCollapsed = false;
    self.searchString = null;
    self.sortDir = null;
};

const actions = [
    ({allExpanded, self} : any) => {
        if(!allExpanded) return;
        if (allExpanded) {
            const t0 = performance.now();
            self.open = true;
            self.querySelectorAll('details').forEach(details => details.open = true);
            const t1 = performance.now();
            console.log(t1 - t0 + ' milliseconds');
        }
        self.allCollapsed = false;
    },
    ({allCollapsed, self}: any) => {
        if(!allCollapsed) return;
        if (allCollapsed) {
            self.removeAttribute('open');
            self.querySelectorAll('details').forEach((details: any) => details.removeAttribute('open'));
        }
        self.allExpanded = false;
    },
    ({searchString, self}: any) => {
        const t0 = performance.now();
        if (searchString === undefined || searchString === null || searchString === '')
            return;
        self.allCollapsed = true;
        const newValLC = searchString.toLowerCase();
        const tNodes = Array.from(self.querySelectorAll('div, summary'));
        tNodes.forEach((el: any) => {
            if (el.textContent!.toLowerCase().indexOf(newValLC) > -1) {
                el.classList.add('match');
            }
            else {
                el.classList.remove('match');
            }
        });
        Array.from(self.querySelectorAll('details')).forEach((detailsEl: any) =>{
            if(detailsEl.querySelector('.match') !== null) detailsEl.open = true;
        });
        const firstMatch = self.querySelector('.match');
        if(firstMatch !== null){
            self.open = true;
            firstMatch.scrollIntoView();
        }
        const t1 = performance.now();
        console.log(t1 - t0 + ' milliseconds');
    },
    // ({sortDir, self}: ExtendedHTMLDetailsElement) => {
    //     if (sortDir === null) return;
    //     Array.from(self.querySelectorAll('section')).forEach(section =>{
    //         const sectionChildren = Array.from(section.children);
    //         const one = sortDir === 'asc' ? 1 : -1;
    //         const minusOne = sortDir === 'asc' ? -1 : 1;
    //         sectionChildren.sort((a: any, b: any) => {
    //             const lhs = getStrVal(a);
    //             const rhs = getStrVal(b);
    //             if (lhs < rhs)
    //                 return minusOne;
    //             if (lhs > rhs)
    //                 return one;
    //             return 0;
    //         });
    //         let count = 1;
    //         sectionChildren.forEach(child => {
    //             const child2 = child as HTMLElement;
    //             const count$ = count.toString();
    //             child2.style.order = count$;
    //             child2.tabIndex = parseInt(count$);
    //             count++;
    //         });
    //     })
    //     //const section = self.querySelector('section') as HTMLTableSectionElement;
        
        
    // }
]

export const treePropActions = [ ...propActions,
    ({self, allExpanded, mainProxy}: XtalTreeDeco) => {
        if(mainProxy === undefined) return;
        (<any>mainProxy).allExpanded = allExpanded;
    },
    ({self, allCollapsed, mainProxy}: XtalTreeDeco) => {
        if(mainProxy === undefined) return;
        (<any>mainProxy).allCollapsed = allCollapsed;
    },
    ({self, searchString, mainProxy}: XtalTreeDeco) => {
        if(mainProxy === undefined) return;
        (<any>mainProxy).searchString = searchString;
    }
] as PropAction<any>[];

export class XtalTreeDeco<ExtendedHTMLDetailsElement = HTMLDetailsElement> extends XtalDeco {
    static is =  'xtal-tree-deco';
    static attributeProps: any = ({allExpanded, allCollapsed, searchString}: XtalTreeDeco) => ({
        bool: [allExpanded, allCollapsed],
        str: [searchString]
    } as AttributeProps);
    init = init as PropAction; //TODO -- figure out how to de-any-fy
    actions = actions as PropAction<any>[];
    virtualProps = ['allExpanded', 'allCollapsed', 'searchString'];

    propActions = treePropActions;
    allExpanded: boolean | undefined;
    allCollapsed: boolean | undefined;
    searchString: string | undefined;
}
define(XtalTreeDeco);

