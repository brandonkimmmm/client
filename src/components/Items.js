import React, { Component } from 'react';
import io from 'socket.io-client';
import { withAlert } from 'react-alert';
import ShowItems from './ShowItems';
import NewItemModal from './NewItemModal';

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            list: undefined
        }

        this.socket = io();

        this.socket.open();

        this.socket.on('ITEM_ADDED', (data) => {
            if(data.listId === this.props.list.id) {
                this.addItem(data);
            }
        })

        this.socket.on('ITEM_UPDATED', (data) => {
            if(data[0].listId === this.props.list.id) {
                this.updateItems(data);
            }
        })

        this.socket.on('ITEM_DELETED', (data) => {
            if(data.listId === this.props.list.id) {
                this.deleteItem(data.items);
            }
        })
    }

    componentDidMount() {
        this.callApi()
        .then(res => {
            this.setState({
                items: res.items
            });
        })
        .catch(err => console.log(err));
    }

    componentDidUpdate(prevProps) {
        if(this.props.list !== prevProps.list) {
            this.setState({
                list: this.props.list
            })
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    addItem = data => {
        this.setState({
            items: [...this.state.items, data]
        });
    }

    updateItems = data => {
        this.setState({
            items: [...data]
        })
    }

    deleteItem = data => {
        this.setState({
            items: [...data]
        })
    }

    callApi = async () => {
        const response = await fetch(`/api/lists/${this.props.list.id}/items`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body);
        return body;
    }

    handleToggle = item => () => {
        this.callToggleApi(item)
        .then(res => {
            if(res && res.items.length !== 0) {
                this.setState({
                    items: res.items
                })
            }
        })
        .catch(err => console.log(err));
    };

    callToggleApi = async (item) => {
        if(!this.props.user || this.props.user.id !== this.props.list.userId) {
            await this.props.alert.show('Must be list owner or member to update item');
            return;
        } else {
            const response = await fetch(`/api/lists/${this.props.list.id}/items/${item.id}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.props.user.id,
                    name: item.name,
                    amount: item.amount,
                    purchased: !item.purchased
                })
            })
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            if(body.message === 'Item successfully updated'){
                this.socket.emit('UPDATE_ITEM', body.items);
            }
            return body;
        }
    }

    handleUpdate = item => {
        this.callUpdateApi(item)
        .then(res => {
            if(res && res.items.length !== 0) {
                this.setState({
                    items: res.items
                })
            }
        })
        .catch(err => console.log(err));
    };

    callUpdateApi = async (item) => {
        if(!this.props.user || this.props.user.id !== this.props.list.userId) {
            await this.props.alert.show('Must be list owner or member to update item');
            return;
        } else {
            const response = await fetch(`/api/lists/${this.props.list.id}/items/${item.id}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.props.user.id,
                    name: item.name,
                    amount: item.amount,
                    purchased: item.purchased
                })
            })
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            if(body.message === 'Item successfully updated'){
                this.socket.emit('UPDATE_ITEM', body.items);
            }
            this.props.alert.show(body.message);
            return body;
        }
    }

    handleDelete = id => {
        this.callDeleteApi(id)
        .then(res => {
            if(res && res.items) {
                this.setState({
                    items: res.items
                })
            }
        })
        .catch(err => console.log(err));
    }

    callDeleteApi = async (id) => {
        if(!this.props.user || this.props.user.id !== this.props.list.userId) {
            this.props.alert.show('Must be list owner or member to delete item');
            return;
        } else {
            const response = await fetch(`/api/lists/${this.props.list.id}/items/${id}/destroy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.props.user.id
                })
            })
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            if(body.message === 'Item was deleted from list'){
                this.socket.emit('DELETE_ITEM', body);
            }
            this.props.alert.show(body.message);
            return body;
        }
    }

    showNewItemButton() {
        if(this.props.user) {
            return <NewItemModal list={this.props.list} userId={this.props.user.id} />
        }
    }

    render() {
        return (
            <div>
                <ShowItems list={this.props.list} user={this.props.user} items={this.state.items} handleUpdate={((item) => this.handleUpdate(item))} handleToggle={(item) => this.handleToggle(item)} handleDelete={(id) => this.handleDelete(id)}/>
                {this.showNewItemButton()}
            </div>
        )
    }
}

export default withAlert(Items);