import React, {Component} from 'react';
import {
  Link,
  NavLink
} from "react-router-dom";

class HomeSidebar extends Component {
  render() {
    var names = [
      'Popular',
      'Topics',
      'Series',
      'Creators',
      'Leaderboard'
    ];
    var links = [
      '/',
      '/topics',
      '/series',
      '/creators',
      '/leaderboard'
    ];
    if (this.props.globals.loggedIn) {
      names.unshift('Subscriptions');
      links.unshift('/subs')
    }
    var options = [];
    for (var l = 0; l < names.length; l++) {
      options.push(
        <NavLink
          className="sidebar_option"
          activeStyle={{
            color: "#883fff"
          }}
          key={l}
          exact to={links[l]}>{names[l]}</NavLink>
      );
    }
    return (
      <div id="sidebar">
        <div className="sidebar_contents">
          {options}

        </div>
        <div className="sidebar_bottom">
          <Link style={{color: "#adadc2"}} to="/about">About</Link><br />
          Artiscribe pre-alpha
        </div>
      </div>
    );
  }
}


export default HomeSidebar;
