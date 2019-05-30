import { define } from 'trans-render/define.js';
import { XtalDeco } from 'xtal-deco/xtal-deco.js';
import { XtalTreeDecoArgs } from './XtalTreeDecoArgs.js';
export class XtalTreeDeco extends XtalDeco {
    constructor() {
        super(...arguments);
        this._decorateArgs = XtalTreeDecoArgs;
    }
    static get is() {
        return 'xtal-tree-deco';
    }
}
define(XtalTreeDeco);
