import React from "react";
//import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { title, closeCallback, undoCallback, redoCallback, hasUndo, hasRedo, currentList} = this.props;
        let undo_button = hasUndo ? <div id='undo-button' className="top5-button" onClick={undoCallback}> &#x21B6; </div>:
        <div id='undo-button' className="top5-button-disabled"> &#x21B6; </div>
        let redo_button = hasRedo ? <div id='redo-button' className="top5-button" onClick={redoCallback}> &#x21B7; </div>:
        <div id='redo-button' className="top5-button-disabled"> &#x21B7; </div>
        let close_button = currentList ? <div id='close-button' className="top5-button" onClick={closeCallback}> &#x24E7; </div>:
        <div id='close-button' className="top5-button-disabled"> &#x24E7; </div>
        return (
            <div id="top5-banner">
                {title}
                <div id="edit-toolbar">
                    {undo_button}
                    {redo_button}
                    {close_button}    
            </div>
            </div>
        );
    }
}