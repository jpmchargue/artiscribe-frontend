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

import credit from './credit.svg';
import heart from './heart.svg';
import heart_dim from './heart_dim.svg';
import logo from './logo.png';
import logo_white from './logo_white.png';
import search_icon from './search_icon.png';
import inkwell from './inkwell.svg';

import home_icon from './home.svg';
import home_icon_dim from './home_dim.svg';
import map_icon from './map.svg';
import map_icon_dim from './map_dim.svg';
import me_icon from './me.svg';
import me_icon_dim from './me_dim.svg';
import dm_icon from './dm.svg';
import dm_icon_dim from './dm_dim.svg';
import notif_icon from './notif.svg';
import notif_icon_dim from './notif_dim.svg';


// GOTO CONSTURL
var API_URL = 'https://artiscribe.com/api/php.php';
var ERROR_URL = 'https://artiscribe.com/error';
var IMG_URL = 'https://artiscribe.com/usercontent/';
var POST_URL = 'https://artiscribe.com/post/';

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
          <Route path="/post/*">
            <PostPage />
          </Route>
          <Route path="/u/*">
            <UserPage />
          </Route>
          <Route path="/error">
            <ErrorPage />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        </div>
      </Router>
    );
  }
}

//<ToggleButton onClick={() => this.loginOverlay()} />
//{this.renderOverlay()}

// GOTO LOGO
function Logo() {
  return (
    <div id="logo_container">
      <a href="https://artiscribe.com" title="Artiscribe Home" id="logo_link">
        <img src={inkwell} id="logo" height="48"/>
      </a>
    </div>
  );
}


function FillerLogo() {
  return (
    <a href="https://artiscribe.com" title="Artiscribe Home" id="logo_link">
      <img src={inkwell} id="inkwell" height="50"/>
      <img src={logo} alt="ARTISCRIBE" id="filler_logo"/>
    </a>
  );
}


// GOTO HOTBAR
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
        if (true) {
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
        var lits = [home_icon, map_icon, me_icon, dm_icon, notif_icon];
        var dims = [home_icon_dim, map_icon_dim, me_icon_dim, dm_icon_dim, notif_icon_dim];
        var dests = [
          "https://artiscribe.com/",
          "https://artiscribe.com/subs",
          myPageLink,
          "https://artiscribe.com/chats",
          "https://artiscribe.com/notifs"
        ]
        var links = [];
        for (var i = 0; i < lits.length; i++) {
          if (i === this.props.location) {
            links.push(
              <a className="navlink" href={dests[i]}>
                <img src={lits[i]} height="30" />
              </a>
            );
          } else {
            links.push(
              <a className="navlink" href={dests[i]}>
                <img src={dims[i]} height="30" />
              </a>
            );
          }
        }
        return <div id="hb_navlinks">{links}</div>;
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
              <img src={heart} alt="Next heart ready in:" id="heart_icon" height="30"/>
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
              <img src={heart_dim} alt="Next heart ready in:" id="heart_icon" height="30"/>
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
            <img src={credit} alt="Credits:" id="credits_icon" height="30"/>
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
        <Logo />
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


// GOTO CONSTPOST
var POST_WIDTH = 382;
var POST_HEIGHT = 382;
var NON_POST_PAGE_WIDTH = 298; // Width of sidebars and their borders
var TOP_LOAD_CUSHION = 500;
var TOP_UNLOAD_DISTANCE = 1000;
var BOTTOM_LOAD_CUSHION = 500;
var BOTTOM_UNLOAD_DISTANCE = 1000;


function getPostsPerRow() {
  return Math.max(Math.floor((window.innerWidth - NON_POST_PAGE_WIDTH)/POST_WIDTH), 1);
}


// GOTO HOME
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      head: 0,
      tail: 0,
      inventory: [],
      reachedEnd: false,
      queriedAbove: false,
      queriedBelow: false,
      metric: 0,
      keystring: "",
      startTime: 0,
      endTime: Math.floor(Date.now() / 1000),
      receivedData: false,
    }
  }

  componentDidMount() {
    setInterval(() => this.updateFeed(), 500)
    let numToLoad = Math.ceil((window.innerHeight + BOTTOM_LOAD_CUSHION) / POST_HEIGHT) * getPostsPerRow();
    let data = {
      function: 'getPosts',
      metric: this.state.metric,
      keystring: this.state.keystring,
      starttime: this.state.startTime,
      endtime: this.state.endTime,
      index: 0,
      number: numToLoad,
    }
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(posts => {
      this.receivePosts(posts);
    })
    this.setState({
      queriedBelow: true,
    });
  }

  receiveHotbarState(state) {
    console.log("Page received hotbar state: " + JSON.stringify(state));
  }

  receiveHotbarSearchbarValue(value) {
    this.setState({
      keystring: value
    });
  }

  updateFeed() {
    var postsPerRow = getPostsPerRow();
    var bottomLine = Math.ceil((this.state.tail - this.state.head)/postsPerRow) * POST_HEIGHT;

    if (((window.scrollY + window.innerHeight + BOTTOM_LOAD_CUSHION) > bottomLine)
      && !(this.state.queriedBelow)
      && !(this.state.reachedEnd)
    ) {
      let numToLoad = Math.ceil((window.scrollY + window.innerHeight + BOTTOM_LOAD_CUSHION - bottomLine) / POST_HEIGHT) * postsPerRow;
      let data = {
        function: 'getPosts',
        metric: this.state.metric,
        keystring: this.state.keystring,
        starttime: this.state.startTime,
        endtime: this.state.endTime,
        index: this.state.tail,
        number: numToLoad,
      }
      fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(posts => {
        this.receivePosts(posts);
      })
      this.setState({
        queriedBelow: true,
      });
    }
    if ((window.scrollY < TOP_LOAD_CUSHION) && !(this.state.queriedAbove) && (this.state.head > 0)) {
      let numToLoad = Math.min(this.head, Math.ceil((TOP_LOAD_CUSHION - window.scrollY) / POST_HEIGHT));
      let data = {
        function: 'getPosts',
        metric: this.state.metric,
        keystring: this.state.keystring,
        starttime: this.state.startTime,
        endtime: this.state.endTime,
        index: this.state.head - numToLoad,
        number: numToLoad,
      }
      fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(posts => {
        this.receivePosts(posts);
      })
      this.setState({
        queriedAbove: true,
      });
    }
  }

  receivePosts(batch) {
    let batchHead = batch[0];
    let batchTail = batch[1];
    if (batchHead === this.state.tail) {
      // Received tail-end batch
      this.state.inventory = this.state.inventory.concat(batch.slice(2));
      this.setState({
        queriedBelow: false,
        tail: batchTail,
      });
    } else if (batchTail === this.state.head) {
      // Received head-end batch
      this.state.inventory = batch.slice(2).concat(this.state.inventory);
      this.setState({
        queriedBelow: false,
        head: batchHead,
      });
    }
  }

  renderPosts() {
    var posts = [];
    for (var n = 0; n < this.state.inventory.length; n++) {
      posts.push(<Post content={this.state.inventory[n]} />);
    }
    return <div className="post_container">{posts}</div>
  }

  render() {
    return (
      <div className="main">
        <div id="sidebar">
          <div className="sidebar_contents">
            <div className="heading">Explore</div>
          </div>
        </div>
        <div id="central_biased">
          <Hotbar full={true} location={0} callback={(state) => this.receiveHotbarState(state)} />
          <div className="central_contents">
            {this.renderPosts()}
          </div>
        </div>
      </div>
    );
  }
}


function humanTimeSince(unixtime) {
  let now = Math.floor(Date.now() / 1000);
  if (unixtime <= 0) { return "the dawn of time" }
  else if (now - unixtime < 0) { return "now"; }
  else if (now - unixtime < 60) {
    let seconds = now - unixtime;
    if (seconds === 1) return "1 second ago";
    else return seconds.toString() + " seconds ago";
  } else if (now - unixtime < 3600) {
    let minutes = Math.floor((now - unixtime) / 60);
    if (minutes === 1) return "1 minute ago";
    else return minutes.toString() + " minutes ago";
  } else if (now - unixtime < 86400) {
    let hours = Math.floor((now - unixtime) / 3600);
    if (hours === 1) return "1 hour ago";
    else return hours.toString() + " hours ago";
  } else if (now - unixtime < 2592000) {
    let days = Math.floor((now - unixtime) / 86400);
    if (days === 1) return "1 day ago";
    else return days.toString() + " days ago";
  } else if (now - unixtime < 31536000) {
    let months = Math.floor((now - unixtime) / 2592000);
    if (months === 1) return "1 month ago";
    else return months.toString() + " months ago";
  } else {
    let years = Math.floor((now - unixtime) / 31536000);
    if (years === 1) return "1 year ago";
    else return years.toString() + " years ago";
  }
}


// GOTO POST
function Post(props) {
  if (props.content === undefined) {
    return <div className="post_error">Failed to retrieve post preview. :(</div>;
  }
  var userinfo = '@' + props.content.username + ', ' + humanTimeSince(props.content.time);
  var destination = POST_URL + props.content.id;
  if (props.content.thumbnail === "") {
    // Post with no thumbnail (text post)
    return (
      <div class="post_spacing">
        <a href={destination}>
          <div className="post">

            <div className="post_lower_boundary">
              <div className="post_title">{props.content.title}</div>
              <div className="post_userinfo">{userinfo}</div>
            </div>
            <div className="post_inset">
              {props.content.text}
            </div>
            <div className="post_stats_text">
              <div className="post_stats_container">
                (post statistics)
              </div>
            </div>

          </div>
        </a>
      </div>
    );
  } else {
    // Post with a thumbnail
    return (
      <a href={destination}>
        <div className="post">
          <div className="post_thumbnail_container">
            <img src={IMG_URL + props.content.thumbnail} className="post_thumbnail" />
          </div>
          <div className="post_upper_boundary">
            <div className="post_title">{props.content.title}</div>
            <div className="post_userinfo">{userinfo}</div>
          </div>
          <div className="post_stats_image">
            <div className="post_stats_container">
              (post statistics)
            </div>
          </div>
        </div>
      </a>
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
        <div id="central_biased">
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
        <div id="central_biased">
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
        <div id="central_biased">
          <Hotbar callback={(state) => this.receiveHotbarState(state)} />
          <div className="central_contents">

          </div>
        </div>
      </div>
    );
  }
}


// GOTO FULLPOST
class PostPage extends React.Component {
  constructor(props) {
    super(props);
    if (window.location.href.slice(-1) === '/') {
      var cleanUrl = window.location.href.slice(0, -1);
    } else var cleanUrl = window.location.href;
    let urlparts = cleanUrl.split('/');
    if ((urlparts.length === 5) && (urlparts[4] !== '')) {
      this.state = {
        postid: urlparts[4],
        content: null,
        receivedData: false,
      }
    } else {
      window.location.href = ERROR_URL;
    }
  }

  componentDidMount() {
    let data = {
      function: 'getPost',
      id: this.state.postid,
    }
    fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(post => {
      console.log(JSON.stringify(post));
      this.setState({
        content: post,
        receivedData: true,
      })
    });
  }

  receiveHotbarState(state) {console.log("called back");}

  renderPostContent() {
    if (this.state.receivedData) {
      return (
        <div>
          <div className="viewpost_title">{this.state.content.title}</div>
          <div className="viewpost_text">{this.state.content.text}</div>
        </div>
      );
    }
  }

  render () {
    return (
      <div className="main">
        <div id="central">
          <Hotbar full={true} callback={(state) => this.receiveHotbarState(state)} />
          <div className="viewpost_contents">
            <div className="viewpost_center">
              {this.renderPostContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


// GOTO USERPAGE
class UserPage extends React.Component {
  constructor(props) {
    super(props);
    if (window.location.href.slice(-1) === '/') {
      var cleanUrl = window.location.href.slice(0, -1);
    } else var cleanUrl = window.location.href;
    let urlparts = cleanUrl.split('/');
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
        <div id="central_biased">
          <Hotbar full={true} location={2} callback={(state) => this.receiveHotbarState(state)} />
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
