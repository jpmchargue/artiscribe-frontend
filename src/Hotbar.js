import React, {Component} from 'react';
import {Link} from "react-router-dom";

import Logo from './Logo.js';

import credit from './credit.svg';
import heart from './heart.svg';
import heart_dim from './heart_dim.svg';
import search_icon from './search_icon.svg';

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


class Hotbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keystring: '',
      time: Math.floor(Date.now() / 1000),
    }
  }
  componentDidMount() {
    setInterval(() => this.setState({time: Math.floor(Date.now() / 1000)}), 1000);
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
    if (this.props.globals.loggedIn) {
      return (
        <div id="hb_thinSearchBarContainer">
          <img src={search_icon} id="search_icon" height="20"/>
          <input type="text" id="searchbar" placeholder="Search Artiscribe"/>
        </div>
      );
    } else {
      return (
        <div id="hb_wideSearchBarContainer">
          <img src={search_icon} id="search_icon" height="20"/>
          <input type="text" id="searchbar" placeholder="Search Artiscribe"/>
        </div>
      );
    }
  }

  renderNavigation() {
    if (this.props.globals.loggedIn) {
      var lits = [home_icon, map_icon, me_icon, dm_icon, notif_icon];
      var dims = [home_icon_dim, map_icon_dim, me_icon_dim, dm_icon_dim, notif_icon_dim];
      var dests = [
        "/",
        "/map",
        "/u/" + this.props.globals.name,
        "/chats",
        "/notifs"
      ]
      var links = [];
      for (var i = 0; i < lits.length; i++) {
        if (i === this.props.location) {
          links.push(
            <Link className="navlink" to={dests[i]} key={i}>
              <img src={lits[i]} height="30" />
            </Link>
          );
        } else {
          links.push(
            <Link className="navlink" to={dests[i]} key={i}>
              <img src={dims[i]} height="30" />
            </Link>
          );
        }
      }
      return <div id="hb_navlinks">{links}</div>;
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
    if (this.props.globals.loggedIn) {
      let currentTime = this.state.time;
      let remainingTime = 86400 - (currentTime - this.props.globals.lastHeartTime);
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

  renderCredits() {
    if (this.props.globals.loggedIn) {
      return (
        <Link to="/credits">
          <div id="hb_balance">
            <img src={credit} alt="Credits:" id="credits_icon" height="30"/>
            <div id="credits_text">{this.props.globals.balance}</div>
          </div>
        </Link>
      );
    }
  }

  renderUserWidget() {
    if (this.props.globals.loggedIn) {
      let icon_location = "https://artiscribe.com/usercontent/" + this.props.globals.icon;
      return (
        <div id="hb_userwidget">
          <img src={icon_location} id="user_icon"/>
          <div id="hb_username">{this.props.globals.name}</div>
        </div>
      );
    }
  }

  renderLoginButton() {
    if (!this.props.globals.loggedIn) {
      return (
        <a href="https://artiscribe.com/login">
          <div id="hb_loginButton">
            Log in
          </div>
        </a>
      );
    }
  }

  renderSignupButton() {
    if (!this.props.globals.loggedIn) {
      return (
        <a href="https://artiscribe.com/signup">
          <div id="hb_signupButton">
            Create an Artiscribe Account
          </div>
        </a>
      );
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


export default Hotbar;
