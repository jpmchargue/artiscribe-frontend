import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  NavLink,
} from "react-router-dom";
import './App.css';

import constants from './constants';

import Login from './Login';
import Signup from './Signup';
import Subscriptions from './Subscriptions';
import Topics from './Topics';
import Series from './Series';
import Creators from './Creators';
import Leaderboard from './Leaderboard';
import Map from './Map';
import Chats from './Chats';
import Notifications from './Notifications';
import Credits from './Credits';
import About from './About';
import Feedback from './Feedback';
import Settings from './Settings';
import Search from './Search';
import PostPage from './PostPage';
import PostEditor from './PostPage';
import UserPage from './UserPage';
import ErrorPage from './ErrorPage';
import Home from './Home';

import Hotbar from './Hotbar';
import HomeSidebar from './HomeSidebar';
import FlexibleLoginForm from './FlexibleLoginForm';
import Scroll from './Scroll'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      globals: null,
      receivedGlobals: false,
      overlayShown: 0,
    }
  }

  componentDidMount() {
    let data = {
      function: 'globals',
    }
    fetch(constants.API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(globals => {
      var FAKE_LOGIN = true;
      var consts = {
        showLoginOverlay: () => this.loginOverlay(),
      }

      var acc = null;
      if (!globals) {
        if (FAKE_LOGIN) {
          acc = {
            name: 'tester',
            icon: 'placeholder.png',
            color: '00ff00',
            birthday: 1596249536,
            balance: 21,
            lastHeartTime: Math.floor(Date.now() / 1000) - 86385,
            numMessages: 3,
            numNotifs: 7,
            loggedIn: true,
          }
        } else {
          acc = {loggedIn: false}
        }
      } else {
        acc = globals;
        acc['loggedIn'] = true;
      }
      for (var key in consts) {
        acc[key] = consts[key];
      }

      this.setState({
        globals: acc,
        receivedGlobals: true,
      });

      console.log(acc);
    });
  }

  renderOverlay() {
    if (this.state.overlayShown === 1) return (<LoginOverlay hideOverlay={() => this.hideOverlay()}/>);
    else if (this.state.overlayShown === 2) return (<LoginOverlay hideOverlay={() => this.hideOverlay()}/>);
  }

  hideOverlay() { this.setState({overlayShown: 0}); }
  loginOverlay() { this.setState({overlayShown: 1}); }
  outdatedBrowserOverlay() { this.setState({overlayShown: 2}); }

  ifReady(page) {
    if (this.state.receivedGlobals) return page;
  }
  ifLoggedInWForm(page) {
    if (this.state.receivedGlobals) {
      if (this.state.globals != null) {
        return page;
      } else return <FlexibleLoginForm />;
    }
  }
  ifLoggedInWBump(page) {
    if (this.state.receivedGlobals) {
      if (this.state.globals != null) {
        return page;
      } else return <Redirect to="/" />;
    }
  }

  render() {
    return (
      <Router>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;900&display=swap" rel="stylesheet" />
        {this.renderOverlay()}
        <Switch>
          // External pages
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>

          // Home subpages, bar '/' (which is necessarily at the bottom)
          <Route path="/subs">
            {this.ifReady(<div>
                <Hotbar globals={this.state.globals} location={0}/>
                <HomeSidebar globals={this.state.globals}/>
            </div>)}
            {this.ifLoggedInWBump(<Subscriptions globals={this.state.globals}/>)}
          </Route>
          <Route path="/topics">
            {this.ifReady(<div>
                <Hotbar globals={this.state.globals} location={0}/>
                <HomeSidebar globals={this.state.globals}/>
                <Topics globals={this.state.globals}/>
            </div>)}
          </Route>
          <Route path="/series">
            {this.ifReady(<div>
                <Hotbar globals={this.state.globals} location={0}/>
                <HomeSidebar globals={this.state.globals}/>
                <Series globals={this.state.globals}/>
            </div>)}
          </Route>
          <Route path="/creators">
            {this.ifReady(<div>
                <Hotbar globals={this.state.globals} location={0}/>
                <HomeSidebar globals={this.state.globals}/>
                <Creators globals={this.state.globals}/>
            </div>)}
          </Route>
          <Route path="/leaderboard">
            {this.ifReady(<div>
                <Hotbar globals={this.state.globals} location={0}/>
                <HomeSidebar globals={this.state.globals}/>
                <Leaderboard globals={this.state.globals}/>
            </div>)}
          </Route>

          // Major menu pages
          <Route path="/map">
            {this.ifReady(<Hotbar globals={this.state.globals} location={1}/>)}
            <Map />
          </Route>
          <Route path="/chats">
            {this.ifReady(<Hotbar globals={this.state.globals} location={3}/>)}
            {this.ifLoggedInWForm(<Chats />)}
          </Route>
          <Route path="/notifs">
            {this.ifReady(<Hotbar globals={this.state.globals} location={4}/>)}
            {this.ifLoggedInWForm(<Notifications />)}
          </Route>

          // Minor menu pages
          <Route path="/credits">
            {this.ifReady(<Hotbar globals={this.state.globals} location={-1}/>)}
            {this.ifLoggedInWForm(<Credits globals={this.state.globals}/>)}
          </Route>
          <Route path="/about">
            {this.ifReady(<Hotbar globals={this.state.globals} location={-1}/>)}
            <About />
          </Route>
          <Route path="/feedback">
            {this.ifReady(<Hotbar globals={this.state.globals} location={-1}/>)}
            {this.ifLoggedInWForm(<Feedback globals={this.state.globals}/>)}
          </Route>
          <Route path="/settings">
            {this.ifReady(<Hotbar globals={this.state.globals} location={-1}/>)}
            {this.ifLoggedInWForm(<Settings globals={this.state.globals}/>)}
          </Route>

          // Non-menu pages
          <Route path="/search">
            {this.ifReady(<div>
              <Hotbar globals={this.state.globals} location={-1}/>
              <Search globals={this.state.globals}/>
            </div>)}
          </Route>
          <Route path="/post/*">
            {this.ifReady(<div>
              <Hotbar globals={this.state.globals} location={-1}/>
              <PostPage globals={this.state.globals}/>
            </div>)}
          </Route>
          <Route path="/edit/*">
            {this.ifReady(<div>
              <Hotbar globals={this.state.globals} location={-1}/>
              <PostEditor globals={this.state.globals}/>
            </div>)}
          </Route>

          {this.state.globals ?
            <Route path={"/u/" + this.state.globals.name}>
              {this.ifReady(<div>
                <Hotbar globals={this.state.globals} location={2}/>
                <UserPage globals={this.state.globals}/>
              </div>)}
            </Route>
          : undefined
          }

          <Route path="/u/*">
            {this.ifReady(<div>
              <Hotbar globals={this.state.globals} location={-1}/>
              <UserPage globals={this.state.globals}/>
            </div>)}
          </Route>

          // Miscellaneous
          <Route path="/error">
            {this.ifReady(<Hotbar globals={this.state.globals} location={-1}/>)}
            <ErrorPage />
          </Route>

          <Route path="/">
            {this.ifReady(<div>
              <Hotbar globals={this.state.globals} location={0}/>
              <HomeSidebar globals={this.state.globals}/>
              <Home globals={this.state.globals}/>
            </div>)}
          </Route>

        </Switch>
      </Router>
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


export default App;
