import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import './signup.css';
import { withAlert } from 'react-alert';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            passwordConfirmation: '',
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
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                username: this.state.username,
                password: this.state.password,
                passwordConfirmation: this.state.passwordConfirmation
            })
        })
        const body = await response.json();
        this.setState({
            email: '',
            username: '',
            password: '',
            passwordConfirmation: '',
        });
        this.props.alert.show(body.message);
        this.props.setUser(body.user);
        if(body.user) { this.setRedirect() };
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handlePassConfChange(event) {
        this.setState({ passwordConfirmation: event.target.value });
    }

    render() {
        return (
        <section className="signup">
            {this.renderRedirect()}
            <h1>Sign Up</h1>
            <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                <label htmlFor="email">Email</label>
                <input className="email signupInput"
                    type="email"
                    placeholder="Enter a valid email"
                    value={this.state.email}
                    onChange={ (e) => this.handleEmailChange(e) }>
                </input>
                <label htmlFor="username">Username</label>
                <input className="username signupInput"
                    type="text"
                    placeholder="Enter a username"
                    value={this.state.username}
                    onChange={ (e) => this.handleUsernameChange(e) }>
                </input>
                <label htmlFor="password">Password</label>
                <input className="password signupInput"
                    type="password"
                    placeholder="Enter a password"
                    value={this.state.password}
                    onChange={ (e) => this.handlePasswordChange(e) }>
                </input>
                <label htmlFor="passwordConfirmation">Password Confirmation</label>
                <input className="passwordConfirmation signupInput"
                    type="password"
                    placeholder="Re-enter your password"
                    value={this.state.passwordConfirmation}
                    onChange={ (e) => this.handlePassConfChange(e) }>
                </input>
                <input className="handleSubmit signupInput" type="submit" value="Submit"></input>
            </form>
        </section>
        )
    }
}

export default withAlert(Signup);