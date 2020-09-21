import React, { Component } from 'react';

import constants from './constants.js';


class Login extends Component {
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
    let data = new FormData();
      data.append('function', 'login');
      data.append('username', this.state.username);
      data.append('password', this.state.password);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data,
    })
    .then(response => response.text())
    .then(text => {
        if (text === '1') {
          window.location.href = "https://artiscribe.com";
        } else {
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
      <div className="formbox_background">
        <div className="formbox">
          <h1>Log in to Artiscribe</h1>
          {this.renderLoginWarning()}
          <form onSubmit={this.handleSubmit}>
            <div className="formbox_label">
              Username:<br />
              <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
            </div>
            <div className="formbox_label">
              Password:<br />
              <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
            </div>
            <input className="formbox_submit" type="submit" value="Submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
