import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayIsVisible: false,
    }
  }

  showOverlay() {
    this.setState({overlayIsVisible: true})
  }

  hideOverlay() {
    this.setState({overlayIsVisible: false})
  }

  renderOverlay() {
    if (this.state.overlayIsVisible) return (<Overlay hideOverlay={() => this.hideOverlay()}/>);
  }

  render() {
    return (
      <Router>
        <div id="page">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/subs">
            <Header />
            <Subscriptions />
            {this.renderOverlay()}
          </Route>
          <Route path="/">
            <Header />
            <Discover />
            <ToggleButton onClick={() => this.showOverlay()} />
            {this.renderOverlay()}
          </Route>
        </Switch>
        </div>
      </Router>
    );
  }
}

function Header() {
  return (
    <div class="header">
      <p> Artiscribe </p>
    </div>
  );
}

function ToggleButton(props) {
  return (
    <button onClick={props.onClick}>
      Toggle Overlay
    </button>
  );
}

function Discover() {
  return (
    <div id="main">
      <h1>Welcome to the discover page.</h1>
    </div>
  );
}

function Login() {
  return <h1>Log in</h1>
}

function Signup() {
  return <h1>Sign up</h1>
}

function Subscriptions() {
  return <h1>Your Subscriptions</h1>
}

function Overlay(props) {
  return (
    <div id="overlay-shadow">
      <div id="overlay">
        Hello there
        <button onClick={props.hideOverlay}>Hide Overlay</button>
      </div>
    </div>
  );
}

export default App;
