import React, { Component } from 'react';
import {
  loadReCaptcha,
  ReCaptcha
} from 'react-recaptcha-v3';

import constants from './constants.js';


class Signup extends Component {
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
      token: '',
    };
    this.usernameRegex = /\W/;
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmationChange = this.handleConfirmationChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  componentDidMount() {
    loadReCaptcha("6LeE77cZAAAAAATa9SWXiWOV5gWZcqkfuHnsCSqr", () => {console.log("Loaded reCaptcha!");});
  }

  handleEmailChange(event) {
    this.setState({email: event.target.value});
    let data = new FormData();
      data.append('function', 'isEmailUnique');
      data.append('email', event.target.value);
    fetch(constants.API_URL, {
        method: 'POST',
        body: data,
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
    fetch(constants.API_URL, {
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
    if (this.state.emailIsUnique && this.state.usernameIsUnique && this.state.passwordsMatch) {
      if ((this.state.email.length === 0) || (this.state.username.length === 0) || (this.state.password.length === 0) || (this.state.confirmation.length === 0)) {
        this.setState({errorId: 1});
      } else {
        let data = {
          function: 'createAccount',
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
        }
        data['g-recaptcha-response'] = this.state.token;
        console.log("submitting: " + JSON.stringify(data));
        fetch(constants.API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
        .then(response => response.text())
        .then(text => {
            if (text === '1') {
              window.location.href = "https://artiscribe.com";
            } else if (text === '[BOT]'){
              this.setState({errorId: 2});
            } else {
              this.setState({errorId: 3});
            }
        });
      }
    }
  }

  verifyCallback(token) { this.setState({token: token}); }

  updateToken() { this.recaptcha.execute(); }

  renderWarning(unneeded, message) {
    if (!unneeded) return <div style={{color: '#f00'}}>{message}</div>;
  }

  usernameCharsValid() {
    return !(this.usernameRegex.test(this.state.username));
  }

  passwordLengthValid() {
    return (this.state.password.length >= 8);
  }

  renderRequirements() {
    return (
      <ul>
        <li style={this.usernameCharsValid() ? {color: "#00bb00"} : {color: "#ff3333"}}>
          Usernames must only contain letters, numbers, and underscores.
        </li>
        <li style={this.passwordLengthValid() ? {color: "#00bb00"} : {color: "#ff3333"}}>
          Passwords must be at least 8 characters long.
        </li>
      </ul>
    );
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
    if (
      (this.state.email.length > 0) &&
      (this.state.username.length > 0) &&
      (this.state.password.length > 0) &&
      (this.state.confirmation.length > 0) &&
      this.usernameCharsValid() &&
      this.passwordLengthValid()
    ) {
      if (this.state.emailIsUnique && this.state.usernameIsUnique && this.state.passwordsMatch) {
        return (<input className="formbox_submit" type="submit" value="Create Account" />);
      }
    }
  }

  render() {
    return (
      <div>
        <ReCaptcha
          ref={ref => this.recaptcha = ref}
          sitekey="6LeE77cZAAAAAATa9SWXiWOV5gWZcqkfuHnsCSqr"
          action='signup'
          verifyCallback={this.verifyCallback}
        />
        <div className="formbox_background">
          <div className="formbox" style={{width: "600px"}}>
            <h1>Create an account</h1>
            {this.renderError()}
            <form onSubmit={this.handleSubmit}>
              <div className="formbox_label">
                Email:
                <input type="text" id="txtEmail" value={this.state.email} onChange={this.handleEmailChange} />
              </div>
              {this.renderWarning(this.state.emailIsUnique, "An account with this email already exists.")}
              <div className="formbox_label">
                Username:
                <input type="text" id="txtUsername" value={this.state.username} onChange={this.handleUsernameChange} />
              </div>
              {this.renderWarning(this.state.usernameIsUnique, "An account with this username already exists.")}
              <div className="formbox_label">
                Password:
                <input type="text" id="txtPassword" value={this.state.password} onChange={this.handlePasswordChange} />
              </div>
              <div className="formbox_label">
                Confirm your password:
                <input type="text" id="txtConfirmation" value={this.state.confirmation} onChange={this.handleConfirmationChange} />
              </div>
              {this.renderWarning(this.state.passwordsMatch, "The two passwords provided do not match.")}
              {this.renderRequirements()}
              {this.renderSubmitButton()}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
