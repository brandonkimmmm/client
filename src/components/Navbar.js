import React, { Component, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withAlert } from 'react-alert';
import ListModal from '../components/ListModal';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
        marginLeft: '10px'
    },
    button: {
        "&:hover": {
            color: "#fff"
        }
    },
};

class ButtonAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    componentDidUpdate = () => {
        if(this.state.redirect === true) {
            this.setState({
                redirect: false
            })
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if(this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/users/signout');
        const body = await response.text();
        this.props.alert.show(body);
        this.props.setUser(undefined);
        this.setRedirect();
    }

    isLogged() {
        const { classes } = this.props;
        if(this.props.user === undefined) {
            return (
                <AppBar position="static">
                    <Toolbar>
                        {/* <IconButton color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton> */}
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            CollabList
                        </Typography>
                        <Button component={ Link } to="/" color="inherit" className={classes.button}>
                            Home
                        </Button>
                        <Button component={ Link } to="/user/signin" color="inherit" className={classes.button}>
                            Sign in
                        </Button>
                    </Toolbar>
                </AppBar>

            )
        } else {
            return (
                <AppBar position="static">
                    <Toolbar>
                        {/* <IconButton color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton> */}
                        <Typography variant="h6" color="inherit">
                            CollabList
                        </Typography>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            {this.props.user.username}
                        </Typography>
                        <Button component={ Link } to="/" color="inherit" className={classes.button}>
                            Lists
                        </Button>
                        <Button type="submit" color="secondary" variant="contained" onClick={ (e) => this.handleSubmit(e)}>
                            Sign out
                        </Button>
                    </Toolbar>
                </AppBar>
            )
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div classes={classes.root}>
                {this.renderRedirect()}
                {this.isLogged()}
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(ButtonAppBar));