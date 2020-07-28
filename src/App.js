import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import logo from './logo.png';

function cra(app, text) {
    if (text === '[O]') {
        // browser is outdated
        app.outdatedBrowserOverlay();
        return false;
    } else return true;
}

function cru(app, text) {
    if (text === '[O]') {
        // browser is outdated
        app.outdatedBrowserOverlay();
        return false;
    } else if (text === '[L]') {
        // browser is outdated
        app.loginOverlay();
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

  renderOverlay() {
    if (this.state.overlayShown === 1) return (<LoginOverlay hideOverlay={() => this.hideOverlay()}/>);
    else if (this.state.overlayShown === 2) return (<LoginOverlay hideOverlay={() => this.hideOverlay()}/>);
  }

  hideOverlay() { this.setState({overlayShown: 0}); }
  loginOverlay() { this.setState({overlayShown: 1}); }
  outdatedBrowserOverlay() { this.setState({overlayShown: 2}); }

  render() {
    return (
      <Router basename='/home'>
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
            <ToggleButton onClick={() => this.loginOverlay()} />
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
      <img src={logo} alt="ARTISCRIBE" />
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


function LoginOverlay(props) {
  return (
    <div id="overlay-shadow">
      <div id="overlay">
        Hello there
        <button onClick={props.hideOverlay}>Hide Overlay</button>
      </div>
    </div>
  );
}


function OutdatedBrowserOverlay(props) {
  return (
    <div id="overlay-shadow">
      <div id="overlay">
        Hello there
        <button onClick={props.hideOverlay}>Hide Overlay</button>
      </div>
    </div>
  );
}


class Login extends React.Component {
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
    event.preventDefault();
    let data = {
      function: 'login',
      username: this.state.username,
      password: this.state.password,
    };
    fetch("https://api.artiscribe.com", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(text => {
        alert(text);
        if (text === '1') {
          window.location.href = "https://artiscribe.com";
        } else {
          alert('Login failed.');
          this.setState({badLogin: true});
        }
    });
  }

  renderLoginWarning() {
    if (this.state.badLogin) {
      return (
        <div style={{color:"#f00"}}>The credentials entered were not recognized.</div>
      );
    }
  }

  render() {
    return (
      <div className="formbox">
        <h1>Log in</h1>
        {this.renderLoginWarning()}
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      confirmation: '',
      errorId: 0,
      emailIsUnique: true,
      usernameIsUnique: true,
      passwordsMatch: true,
      recaptchaRef: React.createRef(),
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmationChange = this.handleConfirmationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
    let data = {
      function: 'isEmailUnique',
      email: event.target.value,
    }
    fetch("https://api.artiscribe.com", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then((text) => {
      if (text === '1') {
        this.setState({emailIsUnique: true});
      } else {
        this.setState({emailIsUnique: false});
      }
    });
  }
  handleUsernameChange(event) {
    this.setState({username: event.target.value});
    let data = {
      function: 'isUsernameUnique',
      username: event.target.value,
    }
    fetch("https://api.artiscribe.com", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(text => {
      if (text === '1') {
        this.setState({usernameIsUnique: true});
      } else {
        this.setState({usernameIsUnique: false});
      }
    });
  }
  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
      passwordsMatch: (event.target.value === this.state.confirmation)
    });
  }
  handleConfirmationChange(event) {
    this.setState({
      confirmation: event.target.value,
      passwordsMatch: (event.target.value === this.state.password)
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.state.recaptchaRef.current.execute();
    if (this.state.emailIsUnique && this.state.usernameIsUnique && this.state.passwordsMatch) {
      if ((this.state.email.length === 0) || (this.state.username.length === 0) || (this.state.password.length === 0) || (this.state.confirmation.length === 0)) {
        //alert("Missing required field!");
        this.setState({errorId: 1});
      } else {
        let data = {
          function: 'createAccount',
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
        }
        data['g-recaptcha-response'] = this.state.recaptchaRef.current.getValue();
        fetch("https://api.artiscribe.com", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        .then(response => response.text())
        .then(text => {
            if (text === '1') {
              let history = useHistory();
              history.push('/');
            } else if (text === '[BOT]'){
              this.setState({errorId: 2});
            } else {
              this.setState({errorId: 3});
            }
        });
      }
    }
  }

  //handleCaptcha(token) {
  //  alert("Submitting...");
  //
  //}

  renderWarning(unneeded, message) {
    if (!unneeded) return <div style={{color: '#f00'}}>{message}</div>;
  }

  renderError() {
    if (this.state.errorId === 1) { // Missing required field
      return (
        <div>
          Not all fields were filled out!
        </div>
      );
    } else if (this.state.errorId === 2) { // Bot-like activity
      return (
        <div>
          Registration failed because your behavior was flagged as bot-like.<br />
          If this was in error, that's our bad! Just try submitting again.
        </div>
      );
    } else if (this.state.errorId === 3) { // Other server failure
      return (
        <div>
          Something went wrong on our end!<br />
          Wait a minute or two, then try again.
        </div>
      );
    }
  }

  renderSubmitButton() {
    if ((this.state.email.length > 0) && (this.state.username.length > 0) && (this.state.password.length > 0) && (this.state.confirmation.length > 0)) {
      if (this.state.emailIsUnique && this.state.usernameIsUnique && this.state.passwordsMatch) {
        return (<button type="submit">Create account</button>);
      }
    }
  }

  render() {
    return (
      <div className="formbox">
        <h1>Create an account</h1>
        {this.renderError()}
        <form onSubmit="handleSubmit">
          <label>
            Email:
            <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
          </label>
          {this.renderWarning(this.state.emailIsUnique, "An account with this email already exists.")}
          <br />
          <label>
            Username:
            <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          </label>
          {this.renderWarning(this.state.usernameIsUnique, "An account with this username already exists.")}
          <br />
          <label>
            Password:
            <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
          </label>
          <br />
          <label>
            Confirm your password:
            <input type="text" value={this.state.confirmation} onChange={this.handleConfirmationChange} />
          </label>
          {this.renderWarning(this.state.passwordsMatch, "The two passwords provided do not match.")}
          {this.renderSubmitButton()}
        </form>
        <ReCAPTCHA
          ref={this.state.recaptchaRef}
          size="invisible"
          sitekey="6Lek9qUZAAAAAGH1XpF5laPEgXYOXVElIZTbigAk"
        />
      </div>
    );
  }
}


function Subscriptions() {
  return <h1>Your Subscriptions</h1>
}


export default App;
