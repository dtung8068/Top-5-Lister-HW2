import React from "react";

export default class Workspace extends React.Component {
    render() {
        const {currentList} = this.props;
        let list = ["", "", "", "", ""]
        if(currentList) {
            for(let i = 0; i <= 4; i++) {
                list[i] = currentList.items[i]
            }
        }
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                    <div id="edit-items">
                        <div id='item-1' class="top5-item" draggable="true"> {list[0]} </div>
                        <div id='item-2' class="top5-item" draggable="true"> {list[1]} </div>
                        <div id='item-3' class="top5-item" draggable="true"> {list[2]} </div>
                        <div id='item-4' class="top5-item" draggable="true"> {list[3]} </div>
                        <div id='item-5' class="top5-item" draggable="true"> {list[4]} </div>
                    </div>
                </div>
            </div>
        )
    }
}