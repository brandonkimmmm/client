import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import { Grid, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListModal from './ListModal.js'
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
            width: 1100,
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
        maxHeight: '350px',
        minHeight: '350px',
        overflow: 'auto'
    }
});

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
                        <Typography variant="h6" align="center" color="inherit">Nothing here...</Typography>
                    </ListItemText>
                </ListItem>
            )
        } else {
            return this.state.userLists.map((list, i) => {
                return (
                    <ListItem key={i}>
                        <ListItemText>
                            <Link to={`/lists/${list.id}`}>
                                <Typography variant="h6" align="center" color="inherit">{list.name}</Typography>
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
                        <Typography variant="h6" align="center" color="inherit">Nothing here...</Typography>
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
                                <Typography variant="h6" align="center" color="inherit">{list.name}</Typography>
                            </Link>
                        </ListItemText>
                    </ListItem>
                )
            })
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Fragment>
                <CssBaseline />
                <main>
                    <div className={classes.heroUnit}>
                        <div className={classes.heroContent}>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                Welcome, {this.props.user.username}!
                            </Typography>
                            <Grid container spacing={16} justify="center">
                                <Grid item>
                                    <ListModal
                                        user={this.props.user}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <div className={classNames(classes.layout, classes.cardGrid)}>
                        <Grid container spacing={40}>
                            <Grid item xs={12} sm={6}>
                                <Card classname={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://www.growthengineering.co.uk/wp-content/uploads/2014/07/To-Do-List.png"
                                        title="Real-time"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h4" align="center" component="h2">
                                            My Lists
                                        </Typography>
                                        <List className={classes.list}>
                                            {this.showUserLists()}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card classname={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://seventhqueen.com/support/wp-content/uploads/2016/05/Paid-Memberships-Pro_1500x1500.jpg"
                                        title="Real-time"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h4" align="center" component="h2">
                                            Memberships
                                        </Typography>
                                        <List className={classes.list}>
                                            {this.showUserMemberships()}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </div>
                </main>
            </Fragment>
        )
    }
}

ShowLists.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(ShowLists);