import jsTPS_Transaction from "jsTPS.js"

export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, initOld, initNew) {
        super();
        this.model = initModel;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    doTransaction() {
        this.app.moveItem(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.app.moveItem(this.newItemIndex, this.oldItemIndex);
    }
}