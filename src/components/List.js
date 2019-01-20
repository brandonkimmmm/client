import React, { Component } from 'react';
import ListTable from './ListTable';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: {
                name: '',
                User: {
                    username: ''
                }
            }
        }
    }

    componentDidMount() {
        this.callApi()
        .then(res => {
            this.setState({
                list: res.list
            });
        })
        .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch(`/api/lists/${this.props.match.params.listId}`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    render() {
        return (
            <section className="list">
                <h1>{this.state.list.name}</h1>
                <h4>Created By: {this.state.list.User.username}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Jill</td>
                            <td>Smith</td>
                            <td>50</td>
                        </tr>
                        <tr>
                            <td>Eve</td>
                            <td>Jackson</td>
                            <td>94</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        )
    }
}

export default List;