import React, { Component } from 'react';
import io from 'socket.io-client';
import { withAlert } from 'react-alert';
import ShowItems from './ShowItems';
import NewItemModal from './NewItemModal';

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [1, 2, 3],
            listId: undefined
        }
    }

    componentDidMount() {
        // this.callApi()
        // .then((res) => {
            this.setState({
                // items: res.items,
            });
        // })
        // .catch((err) => console.log(err));

        // this.socket = io('localhost:5000');

        // this.socket.open()

    }

    componentDidUpdate(prevProps) {
        if(this.props.list !== prevProps.list) {
            this.setState({
                listId: this.props.list.id
            })
        }
    }

    // componentWillUnmount() {
    //     this.socket.close();
    // }

    // callApi = async () => {
    //     const response = await fetch(`/api/lists/${this.props.list.id}/items`);
    //     const body = await response.json();
    //     if(response.status !== 200) throw Error(body.message);
    // }

    showNewItemButton() {
        if(this.props.user) {
            return <NewItemModal listId={this.state.listId} userId={this.props.user.id} />
        }
    }

    render() {
        return (
            <div>
                <ShowItems/>
                {this.showNewItemButton()}
            </div>
        )
    }
}

export default withAlert(Items);