import React, { Component, Fragment } from 'react';
import {Redirect} from 'react-router-dom';
import './signup.css';
import { withAlert } from 'react-alert';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            redirect: false
        };
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
        const response = await fetch('/api/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        this.setState({
            email: '',
            password: ''
        });
        this.props.alert.show(body.message);
        this.props.setUser(body.user);
        if(body.user) { this.setRedirect() };
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    render() {
        const {classes} = this.props;

        return (
            <Fragment>
                {this.renderRedirect()}
                <main className="signup">
                    <CssBaseline />
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign In
                        </Typography>
                        <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input className="email signupInput"
                                    type="email"
                                    name="email"
                                    placeholder="Enter a valid email"
                                    value={this.state.email}
                                    onChange={ (e) => this.handleEmailChange(e) }
                                    autoComplete="email" autoFocus
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input className="password signupInput"
                                    type="password"
                                    name="password"
                                    placeholder="Enter a password"
                                    value={this.state.password}
                                    onChange={ (e) => this.handlePasswordChange(e) }
                                    autoComplete="password" autoFocus
                                />
                            </FormControl>
                            <Button
                                className={classes.submit}
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Sign in
                            </Button>
                        </form>
                    </Paper>
                </main>
            </Fragment>
        )
    }
}

Signin.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withAlert(withStyles(styles)(Signin));