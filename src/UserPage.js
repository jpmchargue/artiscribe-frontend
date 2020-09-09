import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';

import constants from './constants';

import PostBlockSlim from './PostBlockSlim';


class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      user: null,
      posts: null,
      postsPage: 0,
      series: null,
      seriesPage: 0,
      about: null,
    };
    this.username = window.location.href.split('/').slice(-1)[0];
    // The received values indicate whether the loaded information is the desired information.
    this.receivedUser = false;
    this.receivedPosts = false;
    this.receivedSeries = false;
    this.receivedAbout = false;
    // The queried values indicate whether the desired information has been queried, for preventing duplicate queries.
    this.queriedPosts = false;
    this.queriedSeries = false;
    this.queriedAbout = false;
  }

  componentDidMount() {
    this.queryUserInfo(this.username);
    this.queryPosts(this.username, 0); this.queriedPosts = true;
  }

  componentDidUpdate() {
    let target_username = window.location.href.split('/').slice(-1)[0];
    if (target_username !== this.username) {
      this.username = target_username;
      this.queryUserInfo(this.username);
    }
  }

  queryUserInfo(name) {
    let data = {
      function: 'describeUser',
      username: name
    }
    fetch(constants.API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(info => {
      this.setState({ user: info });
      this.receivedUser = true;
    });
  }

  queryPosts(name, page) {
    let data = {
      function: 'getPosts',
      username: name,
      number: 10,
      index: page * 10
    }
    fetch(constants.API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(postdata => {
      this.setState({ posts: postdata });
      this.receivedPosts = true;
      this.queriedPosts = false;
    });
  }

  querySeries(name, page) {
    this.setState({ series: [] });
    this.receivedSeries = true;
    this.queriedSeries = false;
  }

  queryAbout(name) {
    this.setState({ about: [] });
    this.receivedAbout = true;
    this.queriedAbout = false;
  }

  dateOfUnixTime(unixtime) {
    let date = new Date(unixtime * 1000);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear() % 100;
    return month.toString() + '/' + day.toString() + '/' + year.toString();
  }

  renderContents() {
    if (!this.receivedUser) {
      return ( <div className="page_narrow_wrapper">
          {this.renderLoading()}
      </div> );
    } else {
      if (this.state.user === null) {
        return ( <div className="page_narrow_wrapper">
            {this.renderMissing()}
        </div> );
      } else {
        if (this.state.user.name === this.props.globals.name) {
          return ( <div className="page_narrow_wrapper">
              {this.renderTools()}
              {this.renderUser(true)}
          </div> );
        } else {
          return ( <div className="page_narrow_wrapper">
              {this.renderUser(false)}
          </div> );
        }
      }
    }
  }

  renderLoading() {

  }

  renderMissing() {
    return (
      <div className="page_wrapper">
        <div className="page_centered">
          <b>The user you're looking for couldn't be found!</b><br />
          They may have changed their username or deleted their account.
        </div>
      </div>
    );
  }

  goToTab(value) {
    this.setState({ tab: value });
    // if the content object for the tab is null, query it
    var states = [
      this.state.receivedPosts,
      this.state.receivedSeries,
      this.state.receivedAbout
    ];
    var queried = [
      this.queriedPosts,
      this.queriedSeries,
      this.queriedAbout
    ];
    if (!states[value] && !queried[value]) {
      switch (value) {
        case 0:
          this.queryPosts(this.state.user.name, this.state.postsPage); this.queriedPosts = true;
          break;
        case 1:
          this.querySeries(this.state.user.name, this.state.seriesPage); this.queriedSeries = true;
          break;
        case 2:
          this.queryAbout(this.state.user.name); this.queriedAbout = true;
          break;
      }
    }
  }

  renderUser(isme) {
    var iconUrl = constants.IMG_URL + this.state.user.icon;
    var activeTabStyle = {
      color: "#883fff"
    };
    return (
      <div className="userpage_block">
        <div className="userpage_alias">{this.state.user.alias}</div>
        <img className="userpage_icon" src={iconUrl} />
        <div className="userpage_username">@{this.state.user.name}</div>
        <div className="userpage_info_wrap">
          <div className="userpage_info">joined {this.dateOfUnixTime(this.state.user.joined)}</div>
          <div className="userpage_info">{this.state.user.numPosts} posts</div>
          <div className="userpage_info">{this.state.user.numSubscribers} subscribers</div>
          <div className="userpage_info">{this.state.user.numLikes} likes</div>
          <div className="userpage_info">{this.state.user.numHearts} hearts</div>
        </div>
        <div className="userpage_bio">{this.state.user.bio}</div>
        {isme ? null : <div className="userpage_action_wrap">
          <div className="userpage_action">Subscribe</div>
          <div className="userpage_action">Support</div>
        </div>}
        <div className="userpage_tab_wrap">
          <div className="userpage_tab" style={this.state.tab === 0 ? activeTabStyle : null} onClick={() => this.goToTab(0)}>Posts</div>
          <div className="userpage_tab" style={this.state.tab === 1 ? activeTabStyle : null} onClick={() => this.goToTab(1)}>Series</div>
          <div className="userpage_tab" style={this.state.tab === 2 ? activeTabStyle : null} onClick={() => this.goToTab(2)}>About</div>
        </div>
        <div className="userpage_tab_body">
          {this.renderTab(this.state.tab)}
        </div>
      </div>
    );
  }

  renderTools() {
    return <div>Tools</div>;
  }

  renderTab(tab) {
    switch (tab) {
      case 0:
        return this.renderPosts();
        break;
      case 1:
        return this.renderSeries();
        break;
      case 2:
        return this.renderAbout();
        break;
    }
  }

  renderPosts() {
    if (this.state.posts) {
      var blocks = [];
      for (var i = 2; i < this.state.posts.length; i++) {
        blocks.push(
          <PostBlockSlim
            globals={this.props.globals}
            content={this.state.posts[i]}
            key={i}
          />
        );
        console.log(i);
      }
      return <div className="userpage_list">{blocks}</div>;
    }
  }

  renderSeries() {
    return <div>Series</div>;
  }

  renderAbout() {
    return <div>About</div>;
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        {this.renderContents()}
      </div>
    );
  }
}


export default UserPage;
