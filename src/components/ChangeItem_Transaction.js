import jsTPS_Transaction from "jsTPS.js"

export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, initId, initOldText, initNewText) {
        super();
        this.model = initModel;
        this.id = initId;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.app.renameItem(this.id, this.newText);
    }
    
    undoTransaction() {
        this.app.renameItem(this.id, this.oldText);
    }
}