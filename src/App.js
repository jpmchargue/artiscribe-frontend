import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

function cra(app, text) {
    if (text === '[O]') {
        // browser is outdated
        app.outdated_browser_overlay();
        return false;
    } else return true;
}

function cru(app, text) {
    if (text === '[O]') {
        // browser is outdated
        app.outdated_browser_overlay();
        return false;
    } else if (text === '[L]') {
        // browser is outdated
        app.login_overlay();
        return false;
    } else return true;
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayShown: 0,
    }
  }

  showOverlay() {
    this.setState({overlayIsVisible: true})
  }

  hideOverlay() {
    this.setState({overlayIsVisible: false})
  }

  renderOverlay() {
    if (this.state.overlayShown == 1) return (<Overlay hideOverlay={() => this.hideOverlay()}/>);
  }

  login_overlay() {
      this.setState({
          overlayShown: 1,
      });
  }

  outdated_browser_overlay() {
      this.setState({
          overlayShown: 2,
      });
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


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        badLogin: false,
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(event) { this.setState({username: event.target.value}); }

  handlePasswordChange(event) { this.setState({password: event.target.value}); }

  handleSubmit(event) {
    //alert("Submitting username " + this.state.username + " with password " + this.state.password);
    event.preventDefault();
    /*
    let data = {
      function: 'login',
      username: this.state.username,
      password: this.state.password,
    };
    */
    let url = "https://artiscribe.com/php/php.php?function=login&username=" + this.state.username + "&password=" + this.state.password;
    fetch(url)
    .then(response => response.text())
    .then(text => {
        if (text === '1') alert("Login pair recognized!");
        else alert("The provided credentials were not recognized.");
    });
    /*
    fetch('https://artiscribe.com/php/php.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => alert("Received"))
    */
    /*
    ajax(
      {
        function: 'login',
        username: this.state.username,
        password: this.state.password,
      },
      this,
      cra,
      function (response) {
        alert(response);
        if (response === '0') {
          this.setState({badLogin: true})
        } else {
          let history = useHistory();
          history.push('/');
        }
      }
    );
    event.preventDefault();
    */
  }

  renderLoginWarning() {
    if (this.state.badLogin) {
      return (
        <div style="color:#f00;">The credentials entered were not recognized.</div>
      );
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
        </label>
        <label>
          Password:
          <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


function Login() {
  return (
    <LoginForm />
  );
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
