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
    }

    componentDidMount() {
        this.callApi()
        .then(res => {
            this.setState({
                items: res.items
            });
        })
        .catch(err => console.log(err));

        this.socket = io('localhost:5000');

        this.socket.on('ITEM_ADDED', (data) => {
            if(data.listId === this.props.list.id) {
                this.addItem(data);
            }
        })

        this.socket.on('ITEM_TOGGLED', (data) => {
            if(data[0].listId === this.props.list.id) {
                this.toggleItem(data);
            }
        })

        this.socket.open()

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

    toggleItem = data => {
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
            if(res.items.length !== 0) {
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
                this.socket.emit('TOGGLE_ITEM', body.items);
            }
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
                <ShowItems items={this.state.items} handleToggle={(item) => this.handleToggle(item)}/>
                {this.showNewItemButton()}
            </div>
        )
    }
}

export default withAlert(Items);