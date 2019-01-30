import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { Paper, Grid, Typography, List, ListItem, ListItemText } from '@material-ui/core';

class ShowLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLists: [],
            userMemberships: []
        }

        this.socket = io('localhost:5000');

        this.socket.open();

        this.socket.on('LIST_ADDED', (data) => {
            if(this.props.user.id === data.userId) {
                this.addList(data);
            }
        })

        this.socket.on('MEMBER_ADDED', (data) => {
            if(this.props.user.id === data.userId) {
                this.addMembership(data);
            }
        })

    }

    componentDidMount() {
        if(this.props.user) {
            this.callApi()
            .then(res => {
                this.setState({
                    userLists: res.userLists,
                    userMemberships: res.userMemberships
                });
            })
            .catch(err => console.log(err));
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    callApi = async () => {
        const response = await fetch(`/api/users/${this.props.user.id}/lists`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    addList = data => {
        this.setState({
            userLists: [...this.state.userLists, data],
            userMemberships: [...this.state.userMemberships, data]
        });
    }

    addMembership = data => {
        this.setState({
            userMemberships: [...this.state.userMemberships, data]
        });
    }

    showUserLists() {
        if(this.state.userLists.length === 0) {
            return (
                <ListItem>
                    <ListItemText>
                        Nothing here...
                    </ListItemText>
                </ListItem>
            )
        } else {
            return this.state.userLists.map((list, i) => {
                return (
                    <ListItem key={i}>
                        <ListItemText>
                            <Link to={`/lists/${list.id}`}>
                                <Typography variant="display1" align="center" color="primary">{list.name}</Typography>
                            </Link>
                        </ListItemText>
                    </ListItem>
                )
            })
        }
    }

    showUserMemberships() {
        if(this.state.userMemberships.length === 0) {
            return (
                <ListItem>
                    <ListItemText>
                        Nothing here...
                    </ListItemText>
                </ListItem>
            )
        } else {
            let list ;
            return this.state.userMemberships.map((membership, i) => {
                list = membership.List || membership;
                return (
                    <ListItem key={i}>
                        <ListItemText>
                            <Link to={`/lists/${list.id}`}>
                                <Typography variant="display1" align="center" color="primary">{list.name}</Typography>
                            </Link>
                        </ListItemText>
                    </ListItem>
                )
            })
        }
    }

    render() {
        return (
            <Fragment>
                <Grid container>
                    <Grid item xs={12}>
                        <Paper>
                            <Typography variant="display4" align="center" gutterBottom>Welcome back, {this.props.user.username}!</Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={6}>
                        <Paper>
                            <Typography variant="h2" align="center" gutterBottom>My Lists</Typography>
                            <List>
                                {this.showUserLists()}
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>
                            <Typography variant="h2" align="center" gutterBottom>My Memberships</Typography>
                            <List>
                                {this.showUserMemberships()}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}

export default ShowLists;