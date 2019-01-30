import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withAlert } from 'react-alert';
import MemberModal from './MemberModal';
import Items from './Items';
import io from 'socket.io-client';
import { Button, Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import './list.css';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            list: undefined,
            members: [],
            redirect: false,
        }

        this.socket = io('localhost:5000');

        this.socket.open();

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
                    <Fragment>
                        <Grid container>
                            <Grid item xs={12}>
                                <Paper className="list-heading">
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography className="list-title" variant="h1" align="center">{this.state.list.name}</Typography>
                                            <Typography className="list-subtitle" variant="subheading" align="center">Created By: {this.state.list.User.username}</Typography>
                                            <Typography className="list-subtitle" variant="subheading" align="center">Last Updated At: {Date(this.state.list.updatedAt).substring(0, 15)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={8}>
                                <Paper>
                                    <Typography variant="h2" align="center">Items</Typography>
                                    <br></br>
                                    <Items list={this.state.list} user={this.props.user}/>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Typography variant="h2" align="center">
                                        Members
                                        <br></br>
                                        <MemberModal list={this.state.list} />
                                    </Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Username</TableCell>
                                                <TableCell>Email</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.members.map((member, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{member.User.username}</TableCell>
                                                        <TableCell>{member.User.email}</TableCell>
                                                        <TableCell>
                                                            <Button variant="contained" color="secondary" size="small" onClick={ (e, memberId) => this.handleDelete(e, member.id) }>
                                                                <DeleteIcon />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Fragment>
                )
            } else {
                return(
                    <Fragment>
                        <Grid container>
                            <Grid item xs={12}>
                                <Paper className="list-heading">
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography className="list-title" variant="h1" align="center">{this.state.list.name}</Typography>
                                            <Typography className="list-subtitle" variant="subheading" align="center">Created By: {this.state.list.User.username}</Typography>
                                            <Typography className="list-subtitle" variant="subheading" align="center">Last Updated At: {Date(this.state.list.updatedAt).substring(0, 15)}</Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={8}>
                                <Paper>
                                    <Typography variant="h2" align="center">Items</Typography>
                                    <Items list={this.state.list} user={this.props.user}/>
                                </Paper>
                            </Grid>
                            <Grid item xs={4}>
                                <Paper>
                                    <Typography variant="h2" align="center">Members</Typography>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Username</TableCell>
                                                <TableCell>Email</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.members.map((member, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>{member.User.username}</TableCell>
                                                        <TableCell>{member.User.email}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Fragment>
                )
            }
        }
    }

    render() {
        return (
            <Fragment>
                {this.renderRedirect()}
                {this.showList(this.showList.bind(this))}
            </Fragment>
        )
    }
}

export default withAlert(List);