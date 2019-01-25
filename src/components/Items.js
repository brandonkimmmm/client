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

    callApi = async () => {
        const response = await fetch(`/api/lists/${this.props.list.id}/items`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body);
        return body;
    }

    showNewItemButton() {
        if(this.props.user) {
            return <NewItemModal list={this.props.list} userId={this.props.user.id} />
        }
    }

    render() {
        return (
            <div>
                <ShowItems items={this.state.items} />
                {this.showNewItemButton()}
            </div>
        )
    }
}

export default withAlert(Items);