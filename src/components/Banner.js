import React from "react";
//import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { title, closeCallback, undoCallback, redoCallback} = this.props;
        return (
            <div id="top5-banner">
                {title}
                <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    className="top5-button"
                    onClick={undoCallback}>
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className="top5-button"
                    onClick={redoCallback}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className="top5-button"
                    onClick={closeCallback}>
                        &#x24E7;
                </div>
            </div>
            </div>
        );
    }
}