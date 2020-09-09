import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";

import constants from './constants.js';

import thumbsup_icon from './thumbsup.svg';
import thumbsup_gray_icon from './thumbsup_gray.svg';
import thumbsdown_icon from './thumbsdown.svg';
import thumbsdown_gray_icon from './thumbsdown_gray.svg';
import useheart_gray_icon from './useheart_gray.svg';
import useheart_icon from './heart.svg';
import shine_black_icon from './shine_black.svg';
import credit_black_icon from './credit_black.svg';
import credit_icon from './credit.svg';


class PostBlockSlim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: false,
      isDisliked: false,
      isHearted: false,
      isShined: false,
      isTipped: false,
      redirect: false,
    }
    this.destination = '/post/' + props.content.id;
  }

  handleLike = (event) => {
    event.stopPropagation();

    if (!this.state.isLiked) {
      let data = {
        function: 'likePost',
        postid: this.props.content.id
      };
      fetch(constants.API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      .then(response => response.text())
      .then(text => {
        if (text !== '1') {
          this.setState({
            isLiked: false
          });
        }
      });

    } else {
      let data = {
        function: 'unlikePost',
        postid: this.props.content.id
      };
      fetch(constants.API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      .then(response => response.text())
      .then(text => {
        if (text !== '1') {
          this.setState({
            isLiked: true
          });
        }
      });
    }

    this.setState({ isLiked: !this.state.isLiked });
  }

  handleDislike = (event) => {
    event.stopPropagation();
    this.setState({ isDisliked: !this.state.isDisliked });
  }

  handleHeart = (event) => {
    event.stopPropagation();
    this.setState({ isHearted: !this.state.isHearted });
  }

  handleShine = (event) => {
    event.stopPropagation();
    this.setState({ isShined: !this.state.isShined });
  }

  handleTip = (event) => {
    event.stopPropagation();
    this.setState({ isTipped: !this.state.isTipped });
  }

  redirect = (event) => {
    this.setState({
      redirect: true
    });
  }

  loginOverlay = (event) => {
    event.stopPropagation();
    this.props.globals.showLoginOverlay();
  }

  renderRedirect() {
    if (this.state.redirect) {
      return (<Redirect push to={this.destination} />);
    }
  }

  render() {
    if (this.props.content === undefined) {
      return <div className="post_error">Failed to retrieve post preview. :(</div>;
    }
    var userinfo = '@' + this.props.content.username + ', ' + humanTimeSince(this.props.content.time);

    var userlink = (
        <div className="post_userinfo" style={{textAlign: 'right'}}>
          <Link to={'/u/' + this.props.content.username} style={{textDecoration: 'none', color: '#888'}}>{userinfo}</Link>
        </div>
    );

    var type_messages = [
      "Text Post",
      "Image Collection",
      "Webcomic"
    ];

    // Add logged-in check to determine if the login overlay should be thrown?
    if (this.props.globals.loggedIn) {
      var stats = (
        <div className="post_stats">
          <div className="post_stats_container">
            <div className="post_interaction" onClick={this.handleLike}>
              <img src={this.state.isLiked ? thumbsup_icon : thumbsup_gray_icon} height="24" />
              <div className={this.state.isLiked ? "post_stats_text_active" : "post_stats_text"}>{this.props.content.numLikes}</div>
            </div>
            <div className="post_interaction" onClick={this.handleDislike}>
              <img src={this.state.isDisliked ? thumbsdown_icon : thumbsdown_gray_icon} height="24" />
              <div className={this.state.isDisliked ? "post_stats_text_active" : "post_stats_text"}>{this.props.content.numDislikes}</div>
            </div>
            <div className="post_interaction" onClick={this.handleHeart}>
              <img src={this.state.isHearted ? useheart_icon : useheart_gray_icon} height="24" />
              <div className={this.state.isHearted ? "post_stats_text_red" : "post_stats_text"}>{this.props.content.numHearts}</div>
            </div>
            <div className="post_interaction_shine" onClick={this.handleShine}>
              <img src={shine_black_icon} height="24" />
              <div className="post_stats_text">{this.props.content.numShines}</div>
            </div>
            <div className="post_interaction_tip" onClick={this.handleTip}>
              <img src={credit_black_icon} height="24" />
              <div className="post_stats_text">{this.props.content.amtTipped}</div>
            </div>
          </div>
        </div>
      );
    } else {
      var stats = (
        <div className="post_stats">
          <div className="post_stats_container">
            <div className="post_interaction" onClick={this.loginOverlay}>
              <img src={thumbsup_gray_icon} height="24" />
              <div className="post_stats_text">{this.props.content.numLikes}</div>
            </div>
            <div className="post_interaction" onClick={this.loginOverlay}>
              <img src={thumbsdown_gray_icon} height="24" />
              <div className="post_stats_text">{this.props.content.numDislikes}</div>
            </div>
            <div className="post_interaction" onClick={this.loginOverlay}>
              <img src={useheart_gray_icon} height="24" />
              <div className="post_stats_text">{this.props.content.numHearts}</div>
            </div>
            <div className="post_interaction_shine" onClick={this.loginOverlay}>
              <img src={shine_black_icon} height="24" />
              <div className="post_stats_text">{this.props.content.numShines}</div>
            </div>
            <div className="post_interaction_tip" onClick={this.loginOverlay}>
              <img src={credit_black_icon} height="24" />
              <div className="post_stats_text">{this.props.content.amtTipped}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="slimpost" onClick={this.redirect}>
        {this.renderRedirect()}
        {this.props.content.thumbnail !== ""
        ? <div className="slimpost_thumbnail_container">
            <img src={constants.IMG_URL + this.props.content.thumbnail} className="slimpost_thumbnail" />
          </div>
        : null
        }
        <div className="slimpost_content_container">
          <div className="post_title">{this.props.content.title}</div>
          <div className="post_subtitle">{this.props.content.subtitle}</div>
          <div className="post_type">{type_messages[this.props.content.type]}</div>
        </div>
        <div className="slimpost_content_container_right">
          {userlink}
          {stats}
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


export default PostBlockSlim;
