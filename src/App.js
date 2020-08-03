import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import {
  loadReCaptcha,
  ReCaptcha
} from 'react-recaptcha-v3';

import credit from './credit.png';
import heart from './heart.png';
import heart_dim from './heart_dim.png';
import logo from './logo.png';
import search_icon from './search_icon.png';


var API_URL = 'https://artiscribe.com/api/php.php';
var ERROR_URL = 'https://artiscribe.com/error';

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
      <Router>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet" />
        <div id="page">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/subs">
            <Subscriptions />
          </Route>
          <Route path="/chats">
            <Chats />
          </Route>
          <Route path="/notifs">
            <Notifications />
          </Route>
          <Route path="/u/*">
            <Userpage />
          </Route>
          <Route path="/error">
            <ErrorPage />
          </Route>
          <Route path="/">
            <Explore />
          </Route>
        </Switch>
        </div>
      </Router>
    );
  }
}

//<ToggleButton onClick={() => this.loginOverlay()} />
//{this.renderOverlay()}

function Logo() {
  return (
    <a href="https://artiscribe.com" title="Artiscribe Home">
      <img src={logo} alt="ARTISCRIBE" id="logo"/>
    </a>
  );
}


class Hotbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      receivedData: false,
      username: '',
      icon: '',
      color: '',
      birthday: '',
      balance: 0,
      lastHeartTime: 0,
      numMessages: 0,
      numNotifs: 0,
      time: Math.floor(Date.now() / 1000),
    }
  }
  componentDidMount() {
    setInterval(() => this.setState({time: Math.floor(Date.now() / 1000)}), 1000)
    let data = {
      function: 'hotbar',
    }
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(hotbar => {
      console.log(JSON.stringify(hotbar));
      if (hotbar === null) {

        // IS_ANONYMOUS SWITCH
        if (false) {
          this.setState({
            loggedIn: false,
            receivedData: true
          });
        } else {
          this.setState({
            username: 'tester',
            icon: 'placeholder.png',
            color: '00ff00',
            birthday: 1596249536,
            balance: 21,
            lastHeartTime: Math.floor(Date.now() / 1000) - 86385,
            numMessages: 3,
            numNotifs: 7,
            loggedIn: true,
            receivedData: true
          });
        }
        this.props.callback(this.state);
      } else {
        this.setState({
          username: hotbar.name,
          icon: hotbar.icon,
          color: hotbar.color,
          birthday: hotbar.birthday,
          balance: hotbar.balance,
          lastHeartTime: hotbar.lastHeartTime,
          numMessages: hotbar.numMessages,
          numNotifs: hotbar.numNotifs,
          loggedIn: true,
          receivedData: true
        });
        this.props.callback(this.state);
      }
    });
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  renderLoginInfo() {
    if (this.state.receivedData) {
      if (this.state.loggedIn) {
        return (
          <div>
            {JSON.stringify(this.state)}
          </div>
        );
      } else {
        return (
          <div>You are not logged in!</div>
        );
      }
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }

  renderSearchBar() {
    if (this.state.receivedData) {
      if (this.state.loggedIn) {
        return (
          <div id="hb_thinSearchBarContainer">
            <img src={search_icon} id="search_icon"/>
            <input type="text" id="searchbar" placeholder="Search Artiscribe"/>
          </div>
        );
      } else {
        return (
          <div id="hb_wideSearchBarContainer">
            <img src={search_icon} id="search_icon"/>
            <input type="text" id="searchbar" placeholder="Search Artiscribe"/>
          </div>
        );
      }
    }
  }

  renderNavigation() {
    if (this.state.receivedData) {
      if (this.state.loggedIn) {
        let myPageLink = "https://artiscribe.com/u/" + this.state.username;
        return (
          <div id="hb_navlinks">
            <a className="navlink" href="https://artiscribe.com/">Home</a>
            <a className="navlink" href="https://artiscribe.com/subs">Subs</a>
            <a className="navlink" href={myPageLink}>Me</a>
            <a className="navlink" href="https://artiscribe.com/chats">DMs</a>
            <a className="navlink" href="https://artiscribe.com/notifs">Notifs</a>
          </div>
        );
      }
    }
  }

  zeroExt(num, numDigits) {
    var string = num.toString();
    while (string.length < numDigits) {
      string = '0' + string;
    }
    return string;
  }

  renderLastHeartTime() {
    if (this.state.receivedData) {
      if (this.state.loggedIn) {
        let currentTime = this.state.time;
        let remainingTime = 86400 - (currentTime - this.state.lastHeartTime);
        if (remainingTime <= 0) {
          var message = "Ready";
          return (
            <div id="hb_hearttime">
              <img src={heart} alt="Next heart ready in:" id="heart_icon"/>
              <div id="heart_text">{message}</div>
            </div>
          );
        } else {
          let hours = Math.floor(remainingTime / 3600);
          let minutes = Math.floor((remainingTime % 3600) / 60);
          let seconds = remainingTime % 60;
          var message = hours.toString() + ':' + this.zeroExt(minutes, 2) + ':' + this.zeroExt(seconds, 2);
          return (
            <div id="hb_hearttime">
              <img src={heart_dim} alt="Next heart ready in:" id="heart_icon"/>
              <div id="heart_text">{message}</div>
            </div>
          );
        }
      }
    }
  }

  renderCredits() {
    if (this.state.receivedData) {
      if (this.state.loggedIn) {
        return (
          <div id="hb_balance">
            <img src={credit} alt="Credits:" id="credits_icon"/>
            <div id="credits_text">{this.state.balance}</div>
          </div>
        );
      }
    }
  }

  renderUserWidget() {
    if (this.state.receivedData) {
      if (this.state.loggedIn) {
        let icon_location = "https://artiscribe.com/usercontent/" + this.state.icon;
        return (
          <div id="hb_userwidget">
            <img src={icon_location} id="user_icon"/>
            <div id="hb_username">{this.state.username}</div>
          </div>
        );
      }
    }
  }

  renderLoginButton() {
    if (this.state.receivedData) {
      if (!this.state.loggedIn) {
        return (
          <a href="https://artiscribe.com/login">
            <div id="hb_loginButton">
              Log in
            </div>
          </a>
        );
      }
    }
  }

  renderSignupButton() {
    if (this.state.receivedData) {
      if (!this.state.loggedIn) {
        return (
          <a href="https://artiscribe.com/signup">
            <div id="hb_signupButton">
              Create an Artiscribe Account
            </div>
          </a>
        );
      }
    }
  }

  render() {
    return (
      <div id="hotbar">
        {this.renderSearchBar()}
        {this.renderNavigation()}
        <div id="hotbar_right">
          {this.renderLastHeartTime()}
          {this.renderCredits()}
          {this.renderUserWidget()}
          {this.renderLoginButton()}
          {this.renderSignupButton()}
        </div>
      </div>
    );
  }
}


function ToggleButton(props) {
  return (
    <button onClick={props.onClick}>
      Toggle Overlay
    </button>
  );
}


class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      head: 0,
      tail: 0,
      metric: 0,
      starttime: 0,
      endtime: 0,
      receivedData: false,
    }
  }

  componentDidMount() {
    setInterval(() => this.populateFeed(), 500)
    
  }

  receiveHotbarState(state) {
    console.log("Page received hotbar state: " + JSON.stringify(state));
  }

  populateFeed() {
    var postWidth = 382;
    var postHeight = 382;
    var nonPostPageWidth = 298; // Width of sidebars and their borders
    var topLoadCushion = 500;
    var bottomLoadCushion = 500;

    var postsPerRow = Math.max(Math.floor((window.innerWidth - nonPostPageWidth)/postWidth), 1);
    var bottomLine = Math.ceil((this.state.tail - this.state.head)/postsPerRow) * postHeight;
    if ((bottomLine - (window.scrollY + window.innerHeight)) < bottomLoadCushion) {
      // Load the next row, unload the first row
      let swing = postsPerRow;
      let data = {
        function: 'getPosts',

      }
    }
    if ((window.scrollY < topLoadCushion) && (this.state.head > 0)) {
      // Load the previous row, unload the last row
      let swing = postsPerRow;
    }
  }

  render() {
    return (
      <div className="main">
        <div id="sidebar">
          <Logo />
          <div className="sidebar_contents">
            <div className="heading">Explore</div>
          </div>
        </div>
        <div id="central">
          <Hotbar callback={(state) => this.receiveHotbarState(state)} />
          <div className="central_contents">
            <div className="post_container">
              <div className="post"></div>
              <div className="post"></div>
              <div className="post"></div>
              <div className="post"></div>
              <div className="post"></div>
              <div className="post"></div>
              <div className="post"></div>
              <div className="post"></div>
              <div className="post"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


class Subscriptions extends React.Component {
  constructor(props) {
    super(props);
  }
  receiveHotbarState(state) {console.log("called back");}
  render () {
    return (
      <div className="main">
        <div id="sidebar">
          <Logo />
          <div className="sidebar_contents">
            <div className="heading">Subscriptions</div>
          </div>
        </div>
        <div id="central">
          <Hotbar callback={(state) => this.receiveHotbarState(state)} />
          <div className="central_contents">

          </div>
        </div>
      </div>
    );
  }
}


class Chats extends React.Component {
  constructor(props) {
    super(props);
  }
  receiveHotbarState(state) {console.log("called back");}
  render () {
    return (
      <div className="main">
        <div id="sidebar">
          <Logo />
          <div className="sidebar_contents">
            <div className="heading">Chats</div>
          </div>
        </div>
        <div id="central">
          <Hotbar callback={(state) => this.receiveHotbarState(state)} />
          <div className="central_contents">

          </div>
        </div>
      </div>
    );
  }
}


class Notifications extends React.Component {
  constructor(props) {
    super(props);
  }
  receiveHotbarState(state) {console.log("called back");}
  render () {
    return (
      <div className="main">
        <div id="sidebar">
          <Logo />
          <div className="sidebar_contents">
            <div className="heading">Notifications</div>
          </div>
        </div>
        <div id="central">
          <Hotbar callback={(state) => this.receiveHotbarState(state)} />
          <div className="central_contents">

          </div>
        </div>
      </div>
    );
  }
}


class Userpage extends React.Component {
  constructor(props) {
    super(props);
    let urlparts = window.location.href.split('/');
    if ((urlparts.length === 5) && (urlparts[4] !== '')) {
      this.state = {
        username: urlparts[4],
      }
    } else {
      window.location.href = ERROR_URL;
    }

  }
  receiveHotbarState(state) {console.log("called back");}
  render () {

    return (
      <div className="main">
        <div id="sidebar">
          <Logo />
          <div className="sidebar_contents">
            <div className="heading">{this.state.username}</div>
          </div>
        </div>
        <div id="central">
          <Hotbar callback={(state) => this.receiveHotbarState(state)} />
          <div className="central_contents">

          </div>
        </div>
      </div>
    );
  }
}


class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div></div>;
  }
}

/*
function getUsername(props) {
  let location = useLocation();
  console.log(location.pathname);
  return <div>{location.pathname}</div>
}
*/


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
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
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
      token: '',
    };
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
    let data = {
      function: 'isEmailUnique',
      email: event.target.value,
    }
    fetch(API_URL, {
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
    fetch(API_URL, {
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
        fetch(API_URL, {
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

    //this.state.recaptchaRef.current.execute();

  verifyCallback(token) { this.setState({token: token}); }

  updateToken() { this.recaptcha.execute(); }

  /*
  handleCaptcha(token) {
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
        data['g-recaptcha-response'] = token;
        fetch(API_URL, {
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
  */

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
        return (<input type="submit" value="Create Account" />);
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
        <div className="formbox">
          <h1>Create an account</h1>
          {this.renderError()}
          <form onSubmit={this.handleSubmit}>
            <label>
              Email:
              <input type="text" id="txtEmail" value={this.state.email} onChange={this.handleEmailChange} />
            </label>
            {this.renderWarning(this.state.emailIsUnique, "An account with this email already exists.")}
            <br />
            <label>
              Username:
              <input type="text" id="txtUsername" value={this.state.username} onChange={this.handleUsernameChange} />
            </label>
            {this.renderWarning(this.state.usernameIsUnique, "An account with this username already exists.")}
            <br />
            <label>
              Password:
              <input type="text" id="txtPassword" value={this.state.password} onChange={this.handlePasswordChange} />
            </label>
            <br />
            <label>
              Confirm your password:
              <input type="text" id="txtConfirmation" value={this.state.confirmation} onChange={this.handleConfirmationChange} />
            </label>
            {this.renderWarning(this.state.passwordsMatch, "The two passwords provided do not match.")}
            {this.renderSubmitButton()}
          </form>
        </div>
      </div>
    );
  }
}


export default App;
