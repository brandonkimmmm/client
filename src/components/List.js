import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ListTable from './ListTable';
import { withAlert } from 'react-alert';
import MemberModal from './MemberModal';
import Items from './Items';
import io from 'socket.io-client';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            list: undefined,
            members: [],
            redirect: false,
        }

    }

    addMember = data => {
        this.setState({
            members: [...this.state.members, data]
        });
    }

    removeMember = data => {
        this.setState({
            members: data
        });
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
        this.socket = io('localhost:5000');

        this.socket.on('MEMBER_ADDED', (data) => {
            if(data.listId === this.state.list.id) {
                this.addMember(data);
            }
        })

        this.socket.on('MEMBER_REMOVED', (data) => {
            if(data.listId == this.state.list.id) {
                this.removeMember(data.members);
            }
        })

        this.socket.open();
    }

    componentWillUnmount() {
        this.socket.close();
    }

    componentDidUpdate(prevProps) {
        if(this.props.user !== prevProps.user) {
            this.setState({
                user: this.props.user
            })
        }
    }

    callApi = async () => {
        const response = await fetch(`/api/lists/${this.props.match.params.listId}`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if(!body.list) {
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

    handleDelete = async (e, memberId) => {
        e.preventDefault();
        if(!this.props.user || this.props.user.id !== this.state.list.userId) {
            await this.props.alert.show('Must be list owner to remove member');
        } else {
            const response = await fetch(`/api/lists/${this.state.list.id}/members/${memberId}/destroy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.props.user.id,
                    listUserId: this.state.list.userId
                })
            })
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            if(body.message === 'Member was deleted from list'){
                this.socket.emit('REMOVE_MEMBER', body);
            }
            this.props.alert.show(body.message);
        }
    }

    showList = () => {
        if(this.state.list) {
            if(this.props.user && this.state.list.userId === this.props.user.id) {
                return(
                    <section className="list">
                        <h1>{this.state.list.name}</h1>
                        <MemberModal list={this.state.list} />
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
                                {this.state.members.map((member, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{member.User.username}</td>
                                            <td>{member.User.email}</td>
                                            <td>
                                                <form onSubmit={ (e, memberId) => this.handleDelete(e, member.id) }>
                                                    <input className="handleDelete" type="submit" value="Remove"></input>
                                                </form>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <Items list={this.state.list} user={this.props.user}/>
                    </section>
                )
            } else {
                return(
                    <section className="list">
                        <h1>{this.state.list.name}</h1>
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
                        <Items list={this.state.list} user={this.props.user}/>
                    </section>
                )
            }
        }
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                {this.showList(this.showList.bind(this))}
            </div>
        )
    }
}

export default withAlert(List);