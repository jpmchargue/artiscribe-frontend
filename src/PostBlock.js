import React from 'react';

import constants from './constants.js';


const PostBlock = (props) => {
  if (props.content === undefined) {
    return <div className="post_error">Failed to retrieve post preview. :(</div>;
  }
  var userinfo = '@' + props.content.username + ', ' + humanTimeSince(props.content.time);
  var destination = constants.POST_URL + props.content.id;
  var style = {};
  if (props.position !== undefined) { style['top'] = props.position.toString() + "px"; }
  if (props.isVisible) { style['opacity'] = '1'; }
  if (props.content.thumbnail === "") {
    // Post with no thumbnail (text post)
    return (
      <a href={destination}>
        <div className="post" style={style} id={props.blockID}>
          <div className="post_lower_boundary">
            <div className="post_title">{props.content.title} at {props.position}</div>
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
    );
  } else {
    // Post with a thumbnail
    return (
      <a href={destination}>
        <div className="post" style={style} id={props.blockID}>
          <div className="post_thumbnail_container">
            <img src={constants.IMG_URL + props.content.thumbnail} className="post_thumbnail" />
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


export default PostBlock;
