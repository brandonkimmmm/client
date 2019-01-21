import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ListTable from './ListTable';
import { withAlert } from 'react-alert';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: undefined,
            redirect: false
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
        if(Object.keys(body).length === 0 && body.constructor === Object) {
            this.props.alert.show('Error: no lists found with that id');
            this.setRedirect();
            throw Error('No list found with that id');
        }
        return body;
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if(this.state.redirect) {
            return <Redirect to={`/`} />
        }
    }

    showList() {
        if(this.state.list) {
            return(
                <section className="list">
                    <h1>{this.state.list.name}</h1>
                    <h4>Created By: {this.state.list.User.username}</h4>
                    <h4>Created At: {Date(this.state.list.createdAt)}</h4>
                    <h4>Last Updated At: {Date(this.state.list.updatedAt)}</h4>
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

    render() {
        return (
            <div>
                {this.renderRedirect()}
                {this.showList()}
            </div>
        )
    }
}

export default withAlert(List);