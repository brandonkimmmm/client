import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { withAlert } from 'react-alert';
import MemberModal from './MemberModal';
import Items from './Items';
import io from 'socket.io-client';
import { Button, Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody, List, ListItem, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import './list.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import classNames from 'classnames';
import CardMedia from '@material-ui/core/CardMedia';

const styles = theme => ({
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
        paddingBottom: '40px',
        marginBottom: '50px'
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    list: {
        maxHeight: '300px',
        height: '300px',
        overflow: 'auto'
    }
});

class ShowList extends Component {
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
        const { classes } = this.props;

        if(this.state.list) {
            if(this.props.user && this.state.list.userId === this.props.user.id) {
                return(
                    <main>
                        <div className={classes.heroUnit}>
                            <div className={classes.heroContent}>
                                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                    {this.state.list.name}
                                </Typography>
                                <Grid container spacing={16} justify="center">
                                    <Grid item>
                                        <Typography className="list-subtitle" variant="subheading" align="center">Created By: {this.state.list.User.username}</Typography>
                                        <Typography className="list-subtitle" variant="subheading" align="center">Last Updated At: {Date(this.state.list.updatedAt).substring(0, 15)}</Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                        <div className={classNames(classes.layout, classes.cardGrid)}>
                            <Grid container spacing={40}>
                                <Grid item xs={12} sm={8}>
                                    <Card classname={classes.card}>
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h4" align="center" component="h2">
                                                Items
                                            </Typography>
                                            <Items list={this.state.list} user={this.props.user}/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card classname={classes.card}>
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h4" align="center" component="h2">
                                                Members
                                            </Typography>
                                            <MemberModal list={this.state.list} />
                                            {/* <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Username</TableCell>
                                                        <TableCell>Email</TableCell>
                                                        <TableCell></TableCell>
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
                                            </Table> */}
                                            <List className={classes.list}>
                                                {this.state.members.map((member, i) => (
                                                    <ListItem key={i} role={undefined} dense button>
                                                        <ListItemText><Typography variant="subtitle1">{member.User.email}</Typography></ListItemText>
                                                        <Button variant="contained" color="secondary" size="small" onClick={ (e, memberId) => this.handleDelete(e, member.id) }>
                                                            <DeleteIcon />
                                                        </Button>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>

                        {/* <Grid container>
                            <Grid item xs={8}>
                                <Typography variant="h2" align="center">Items</Typography>
                                <br></br>
                                <Items list={this.state.list} user={this.props.user}/>
                            </Grid>
                            <Grid item xs={4}>
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
                            </Grid>
                        </Grid> */}
                    </main>
                )
            } else {
                return(
                    <main>
                        <div className={classes.heroUnit}>
                            <div className={classes.heroContent}>
                                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                    {this.state.list.name}
                                </Typography>
                                <Grid container spacing={16} justify="center">
                                    <Grid item>
                                        <Typography className="list-subtitle" variant="subheading" align="center">Created By: {this.state.list.User.username}</Typography>
                                        <Typography className="list-subtitle" variant="subheading" align="center">Last Updated At: {Date(this.state.list.updatedAt).substring(0, 15)}</Typography>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                        <div className={classNames(classes.layout, classes.cardGrid)}>
                            <Grid container spacing={40}>
                                <Grid item xs={12} sm={8}>
                                    <Card classname={classes.card}>
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h4" align="center" component="h2">
                                                Items
                                            </Typography>
                                            <Items list={this.state.list} user={this.props.user}/>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card classname={classes.card}>
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h4" align="center" component="h2">
                                                Members
                                            </Typography>
                                            {/* <Table className={classes.table}>
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
                                            </Table> */}
                                            <List className={classes.list}>
                                                {this.state.members.map((member, i) => (
                                                    <ListItem key={i} role={undefined} dense button>
                                                        <ListItemText><Typography variant="subtitle1">{member.User.email}</Typography></ListItemText>
                                                        {/* <Button onClick={ (e, id) => this.handleDelete(e, item.id) } color="secondary" variant="contained" size="small">
                                                            <DeleteIcon />
                                                        </Button> */}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>

                        {/* <Grid container spacing={16} justify="center">
                            <Grid item xs={7}>
                                <Typography variant="h2" align="center" className={classes.title}>Items</Typography>
                                <Items list={this.state.list} user={this.props.user}/>
                            </Grid>
                            <Grid item xs={.5}>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="h2" align="center" className={classes.title}>Members</Typography>
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
                            </Grid>
                        </Grid> */}
                    </main>
                )
            }
        }
    }

    render() {

        return (
            <Fragment>
                <CssBaseline />
                {this.renderRedirect()}
                {this.showList(this.showList.bind(this))}
            </Fragment>
        )
    }
}

ShowList.PropTypes = {
    classes: PropTypes.object.isRequired
}

export default withAlert(withStyles(styles)(ShowList));