import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import './landing.css';
import ShowLists from './ShowLists';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    icon: {
        marginRight: theme.spacing.unit * 2,
    },
    heroUnit: {
        backgroundColor: theme.palette.background.paper,
        paddingBottom: '40px'
    },
    heroContent: {
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
    },
    heroButtons: {
        marginTop: theme.spacing.unit * 4,
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
});

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        }
    }

    componentDidMount() {
        this.setState({
            user: this.props.user
        })
    }

    componentDidUpdate(prevProps) {
        if(this.props.user !== prevProps.user) {
            this.setState({
                user: this.props.user
            })
        }
    }

    showLanding() {
        const { classes } = this.props;
        if(!this.props.user) {
            return (
                <Fragment>
                    <CssBaseline />
                    <main>
                        <div className={classes.heroUnit}>
                            <div className={classes.heroContent}>
                                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                    Welcome to CollabList!
                                </Typography>
                                <Typography variant="h6" align="center" color="textSecondary">
                                    An app that allows you to create and modify different types of to-do lists. Collaborate and coordinate with other users using our real-time app to finish tasks from grocery shopping to daily chores. Sign up today to get started!
                                </Typography>
                            </div>
                            <div className={classes.heroButtons}>
                                <Grid container spacing={16} justify="center">
                                    <Grid item>
                                        <Button component={ Link } to="/user/signup" variant="contained" color="primary">
                                            Sign up
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                        <div className={classNames(classes.layout, classes.cardGrid)}>
                            <Grid container spacing={40}>
                                <Grid item sm={4}>
                                    <Card classname={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image="https://static.adweek.com/adweek.com-prod/wp-content/uploads/sites/2/2016/04/twitter-list.jpg"
                                            title="Create"
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                Create
                                            </Typography>
                                            <Typography>
                                                Create lists where you can add, check off, update, and remove items.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item sm={4}>
                                    <Card classname={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image="https://www.barco.com/~/media/images/products/a%20-%20d/clickshare/meeting%20room%20shots/meetingroom_2625%20projection_s%20jpg.jpg?mw=700&mh=456"
                                            title="Collaborate"
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                Collaborate
                                            </Typography>
                                            <Typography>
                                                Add members to or become members of lists so you can collaborate on a variety of lists.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item sm={4}>
                                    <Card classname={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwVgxU5yfn91Kxu4xVN7fJRp8wlg7joSNQjsPwft0nJaYNSwEb"
                                            title="Real-time"
                                        />
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                Real-Time
                                            </Typography>
                                            <Typography>
                                                Be updated on what members accomplish, add, or delete to a list as they happen.
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </main>
                </Fragment>
            )
        } else {
            return (
                <ShowLists user={this.props.user}/>
            )
        }
    }

    render() {
        return (
            <Fragment>
                {this.showLanding()}
            </Fragment>
        )
    }
}

Landing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);