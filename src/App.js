import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Signup from './components/Signup';
import Signin from './components/Signin';
import List from './components/List';
import ButtonAppBar from './components/Navbar';
import { withAlert } from 'react-alert';

class App extends Component {
  state = {
    user: undefined
  }

  componentDidMount() {
    this.callApi()
    .then(res => {
      this.setState({ user: res });
    })
    .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/users/isAuthenticated');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body.user;
  }

  setUser(user) {
    this.setState({ user: user });
  }

  alert(message) {
    this.props.alert.show(message);
  }

  render() {
    return (
      <div className="App">
        <header>
          <ButtonAppBar
            user={this.state.user}
            setUser={(user) => this.setUser(user)}
          />
        </header>
        <main>
          <Route exact path='/' component={Landing} />
          <Route
            path='/user/signup'
            render={(props) => <Signup user={this.state.user} setUser={(user) => this.setUser(user)} alert={(message) => this.alert(message)}/>}
          />
          <Route
            path='/user/signin'
            render={(props) => <Signin user={this.state.user} setUser={(user) => this.setUser(user)} />}
          />
          <Route
            path="/lists/:listId"
            render={(props) => <List {...props} user={this.state.user} />}
          />
        </main>
      </div>
    );
  }
}

export default withAlert(App);
