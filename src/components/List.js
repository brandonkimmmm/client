import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ListTable from './ListTable';
import { withAlert } from 'react-alert';
import MemberModal from './MemberModal';
import io from 'socket.io-client';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: undefined,
            members: [],
            redirect: false,
        }

        this.socket = io('localhost:5000');

        this.socket.on('MEMBER_ADDED', function(data) {
            addMember(data);
        })

        const addMember = data => {
            this.setState({
                members: [...this.state.members, data]
            });
        }
    }

    componentDidMount() {
        this.callApi()
        .then(res => {
            this.setState({
                list: res.list,
                members: res.members
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

    memberAdded = () => {
        this.socket.emit('ADD_MEMBER', {
            list: this.state.list
        });
    }

    checkIfOwner = () => {
        if(this.state.list && this.props.user && this.state.list.userId === this.props.user.id) {
            return (
                <MemberModal list={this.state.list} />
            )
        }
    }

    showList() {
        if(this.state.list) {
            return(
                <section className="list">
                    <h1>{this.state.list.name}</h1>
                    {this.checkIfOwner()}
                    <h4>Created By: {this.state.list.User.username}</h4>
                    <h4>Created At: {Date(this.state.list.createdAt)}</h4>
                    <h4>Last Updated At: {Date(this.state.list.updatedAt)}</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.members.map(function(member, i){
                                return (
                                    <tr key={i}>
                                        <td>{member.User.username}</td>
                                        <td>{member.User.email}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {/* <table>
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
                    </table> */}
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