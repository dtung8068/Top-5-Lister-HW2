import React from "react";
import ListCard from "./ListCard";

export default class Sidebar extends React.Component {
    render() {
        const { heading,
                currentList,
                keyNamePairs,
                createNewListCallback, 
                deleteListCallback, 
                loadListCallback,
                renameListCallback} = this.props;
        let addListButton = currentList ? <input type="button" id="add-list-button" onClick={createNewListCallback} className="top5-button-disabled" value="+" />:
        <input type="button" id="add-list-button" onClick={createNewListCallback} className="top5-button" value="+" />
        return (
            <div id="top5-sidebar">
                <div id="sidebar-heading">
                    {addListButton}
                    {heading}
                </div>
                <div id="sidebar-list">
                {
                    keyNamePairs.map((pair) => (
                        <ListCard
                            key={pair.key}
                            keyNamePair={pair}
                            selected={(currentList !== null) && (currentList.key === pair.key)}
                            deleteListCallback={deleteListCallback}
                            loadListCallback={loadListCallback}
                            renameListCallback={renameListCallback}
                        />
                    ))
                }
                </div>
            </div>
        );
    }
}