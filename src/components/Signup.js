import React, { Component } from 'react';
// import {Link} from 'react-router-dom';
import './signup.css';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            passwordConf: ''
        };
    }

    signupSubmit(e, email, username, password) {
        e.preventDefault();
        this.setState({
            email: '',
            username: '',
            password: '',
            passwordConf: ''
        });
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
        this.setState({ passwordConf: event.target.value });
    }

    render() {
        return (
        <section className="signup">
            <h1>Sign Up</h1>
            <form className="signupForm" onSubmit={ (e, email, username, password) => this.signupSubmit(e, this.state.email, this.state.username, this.state.password) }>
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
                <label htmlFor="passwordConf">Password Confirmation</label>
                <input className="passwordConf signupInput"
                    type="password"
                    placeholder="Re-enter your password"
                    value={this.state.passwordConf}
                    onChange={ (e) => this.handlePassConfChange(e) }>
                </input>
                <input className="signupSubmit signupInput" type="submit" value="Submit"></input>
            </form>
        </section>
        )
    }
}

export default Signup;