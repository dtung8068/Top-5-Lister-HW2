import React, { Component } from 'react';

export default class DeleteModal extends Component {
    render() {
        const { hideDeleteListModalCallback, deleteListCallback, keyNamePair} = this.props;
        let name = "";
        if (keyNamePair) {
            name = keyNamePair.name;
            return (
                <div
                    className="modal is-visible"
                    id="delete-modal"
                    data-animation="slideInOutLeft">
                    <div className="modal-dialog">
                        <header className="dialog-header">
                            Delete the {name} Top 5 List?
                        </header>
                        <div id="confirm-cancel-container">
                            <button
                                id="dialog-yes-button"
                                className="modal-button"
                                onClick={deleteListCallback}
                            >Confirm</button>
                            <button
                                id="dialog-no-button"
                                className="modal-button"
                                onClick={hideDeleteListModalCallback}
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }
}