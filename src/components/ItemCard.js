import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.name,
            id: this.props.id,
            editActive: false,
        }
    }
    handleDragStart = (event) => {
        event.dataTransfer.setData("text", this.state.id);
    }
    handleDragOver = (event) => {
        event.preventDefault();
    }
    handleDragDrop = (event) => {
        event.preventDefault();
        let oldIndex = parseInt(event.dataTransfer.getData("text"));
        let newIndex = this.state.id;
        if (oldIndex !== newIndex) {
            this.props.moveItemCallback(oldIndex, newIndex);
        }
    }
    handleClick = (event) => {
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleLoadItem = (event) => {
        let itemKey = event.target.id;
        if (itemKey.startsWith("item-card-text-")) {
            itemKey = itemKey.substring("item-card-text-".length);
        }
        this.props.loadItemCallback(itemKey);
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }
    handleUpdate = (event) => {
        this.setState({ text: event.target.value });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let id = this.props.id;
        let textValue = this.state.text;
        console.log("ItemCard handleBlur: " + textValue);
        this.props.renameItemCallback(id, textValue);
        this.handleToggleEdit();
    }

    render() {
        const {name, id} = this.props;
        if (this.state.editActive) {
            return (
                <input
                    id={"item-text-input-" + (id + 1)}
                    className='item-card'
                    type='text'
                    onChange={this.handleUpdate}
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    defaultValue={name}
                    autoFocus
                />)
        }
        else {
            return (
                <div
                    id={'item-' + (id + 1)}
                    key={id}
                    draggable = "true"
                    onDragStart={this.handleDragStart}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDragDrop}
                    onClick={this.handleClick}
                    className='top5-item'>
                    <span
                        id={"item-card-text-" + id}
                        key={id}
                        className="item-card-text">                                                                                
                        {name}
                    </span>
                </div>
            );
        }
    }
}