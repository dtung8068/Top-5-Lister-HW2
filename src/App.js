import React from 'react';
import './fonts/LexendExa/css.css';
import './App.css';
import jsTPS from "./common/jsTPS.js";
import ChangeItem_Transaction from "./components/ChangeItem_Transaction.js";
import MoveItem_Transaction from "./components/MoveItem_Transaction.js";

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);
        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();
        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData,
            keyNamePair : null,
            hasUndo: this.tps.hasTransactionToUndo(),
            hasRedo: this.tps.hasTransactionToRedo(),
        }
        this.hideDeleteListModal = this.hideDeleteListModal.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?1", "?2", "?3", "?4", "?5"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
        
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    renameItem = (id, newName) => {
        let newCurrentList = this.state.currentList;
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        newCurrentList.items[id] = newName;
        this.setState({currentList: newCurrentList, 
            hasRedo: this.tps.hasTransactionToRedo(),
            hasUndo: this.tps.hasTransactionToUndo(),})
        this.db.mutationUpdateList(newCurrentList);
    }
    addRenameItemTransaction = (id, newName) => {
        let oldName = this.state.currentList.items[id];
        let transaction = new ChangeItem_Transaction(this, id, oldName, newName);
        this.tps.addTransaction(transaction);
    }
    moveItem = (oldIndex, newIndex) => {
        let newCurrentList = this.state.currentList;
        let temp = newCurrentList.items[newIndex];
        newCurrentList.items[newIndex] = newCurrentList.items[oldIndex];
        if(oldIndex < newIndex) {
            for(let i = oldIndex; i < newIndex - 1; i++) {
                newCurrentList.items[i] = newCurrentList.items[i+1];
            }
            newCurrentList.items[newIndex - 1] = temp;
        }
        else {
            for(let i = oldIndex; i > newIndex + 1; i--) {
                newCurrentList.items[i] = newCurrentList.items[i-1];
            }
            newCurrentList.items[newIndex + 1] = temp;
        }
        this.setState({currentList: newCurrentList,
            hasRedo: this.tps.hasTransactionToRedo(),
            hasUndo: this.tps.hasTransactionToUndo(),})
        this.db.mutationUpdateList(newCurrentList);
    }
    addMoveItemTransaction = (oldIndex, newIndex) => {
        let transaction = new MoveItem_Transaction(this, oldIndex, newIndex);
        this.tps.addTransaction(transaction);
    }
    
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            currentList: null,
            hasRedo: this.tps.hasTransactionToRedo(),
            hasUndo: this.tps.hasTransactionToUndo(),
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
    }
    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.setState({
            keyNamePair: keyNamePair
        })
    }
    removeList = () => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        let index = 0;
        for(let i = 0; i < newKeyNamePairs.length; i++) {
            if(newKeyNamePairs[i].key === this.state.keyNamePair.key) {
                index = i;
            }
        }
        newKeyNamePairs.splice(index, 1);
        this.sortKeyNamePairsByName(newKeyNamePairs);
        this.tps.clearAllTransactions();
        let list = this.db.queryGetList(index);
        this.setState(prevState => ({
            currentList: null,
            keyNamePair: null, 
            sessionData: {
                nextKey: prevState.sessionData.nextKey - 1,
                counter: prevState.sessionData.counter - 1,
                keyNamePairs: newKeyNamePairs,
            }
            
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationDeleteList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        this.setState({
            keyNamePair: null
        })
    }
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
            this.setState({
                hasRedo: this.tps.hasTransactionToRedo(),
                hasUndo: this.tps.hasTransactionToUndo(),
            })
        }
    }
    redo() {
        if(this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            this.setState({
                hasRedo: this.tps.hasTransactionToRedo(),
                hasUndo: this.tps.hasTransactionToUndo(),
            })
        }
    }
    handleKeyPress = (event) => {
        if(event.ctrlKey && event.key === 'z') {
            this.undo();
        }
        else if(event.ctrlKey && event.key=== 'y') {
            this.redo();
        }
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress, false);
    }

    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList} 
                    undoCallback={this.undo}
                    redoCallback={this.redo}
                    hasRedo={this.state.hasRedo}
                    hasUndo={this.state.hasUndo}
                    currentList={this.state.currentList}/>
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    loadListCallback={this.loadList}
                    deleteListCallback={this.deleteList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList}
                    renameItemCallback={this.addRenameItemTransaction}
                    moveItemCallback={this.addMoveItemTransaction} />
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteListCallback={this.removeList}
                    keyNamePair = {this.state.keyNamePair}
                />
            </div>
        );
    }
}

export default App;
