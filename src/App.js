import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import ButtonAppBar from './components/Navbar';

class App extends Component {
  // state = {
  //   response: '',
  // }

  // componentDidMount() {
  //   this.callApi()
  //   .then(res => this.setState({ response: res.express }))
  //   .catch(err => console.log(err));
  // }

  // callApi = async () => {
  //   const response = await fetch('/api/hello');
  //   const body = await response.json();

  //   if (response.status !== 200) throw Error(body.message);

  //   return body;
  // }

  render() {
    return (
      <div className="App">
        <header>
          <ButtonAppBar />
          {/* <p>{this.state.response}</p> */}
        </header>
        <main>
          <Route exact path='/' component={Landing} />
        </main>
      </div>
    );
  }
}

export default App;
