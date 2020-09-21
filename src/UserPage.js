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
      subscribed: false,
      posts: null,
      postsPage: 0,
      series: null,
      seriesPage: 0,
      about: null,
      editing: false,
      editAlias: "",
      editColor: "",
      editColorValid: false,
      editBio: "",
      editIconExists: false,
      editBackgroundExists: false,
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

    this.handleAliasChange = this.handleAliasChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);

    this.hexRegex = /[^0-9a-fA-F]/;
  }

  componentDidMount() {
    this.queryUserInfo(this.username);
    this.queryPosts(this.username, 0); this.queriedPosts = true;
    setInterval(() => this.checkFileUploads(), 100)
  }

  componentDidUpdate() {
    let target_username = window.location.href.split('/').slice(-1)[0];
    if (target_username !== this.username) {
      this.username = target_username;
      this.queryUserInfo(this.username);
    }
  }

  queryUserInfo(name) {
    let data = new FormData();
      data.append('function', 'userpage');
      data.append('username', name);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data,
    })
    .then(response => response.json())
    .then(info => {
      var userobj = info[0];
      this.setState({
        user: userobj,
        subscribed: info[1],
        editAlias: userobj.alias,
        editColor: userobj.color,
        editColorValid: !(this.hexRegex.test(userobj.color)),
        editBio: userobj.bio,
      });
      this.receivedUser = true;
    });
  }

  queryPosts(name, page) {
    let data = new FormData();
      data.append('function', 'getPosts');
      data.append('username', name);
      data.append('number', 10);
      data.append('index', page * 10);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data,
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

  renderBackground() {
    if (this.receivedUser) {
      if (this.state.user.background.length > 0) {
        return <img className="userpage_background" src={constants.IMG_URL + this.state.user.background} />
      }
    }
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
              {this.renderEditor()}
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

  renderSubButtons(isme) {
    if (!isme) {
      return (
        <div className="userpage_action_wrap">
          {this.state.subscribed
            ? <div className="userpage_action_active" onClick={() => this.unsubscribe()}>Unsubscribe</div>
            : <div className="userpage_action" onClick={() => this.subscribe()}>Subscribe</div>
          }
          <div className="userpage_action">Support</div>
        </div>
      );
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
      this.receivedPosts,
      this.receivedSeries,
      this.receivedAbout
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
        <div className="userpage_alias" style={{color: "#" + this.state.user.color}}>{this.state.user.alias}</div>
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
        {this.renderSubButtons(isme)}
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

  renderTab(tab) {
    switch (tab) {
      case 0:
        return this.renderPosts();
      case 1:
        return this.renderSeries();
      case 2:
        return this.renderAbout();
    }
  }

  renderPosts() {
    if (this.state.posts){
      if (this.state.posts.length > 2) {
        var blocks = [];
        for (var i = 2; i < this.state.posts.length; i++) {
          blocks.push(
            <PostBlockSlim
              globals={this.props.globals}
              content={this.state.posts[i]}
              key={i}
            />
          );
        }
        return <div className="userpage_list">{blocks}</div>;
      } else {
        console.log("No posts found");
        return (
          <div className="userpage_issue">{this.state.user.alias} hasn't made any posts.</div>
        );
      }
    }
  }

  renderSeries() {
    return <div>Series</div>;
  }

  renderAbout() {
    return <div>About</div>;
  }

  renderTools() {
    return (
      <div className="edittool_container">
        <div className="edittool" onClick={() => {this.setState({editing: !this.state.editing})}}>Edit Your Page</div>
        <div className="edittool">Create Blog Entry</div>
        <div className="edittool">Create Image Collection</div>
        <div className="edittool">Create Webcomic Issue</div>
        <div className="edittool">Establish a Series</div>
      </div>
    );
  }

  subscribe() {
    let data = new FormData();
      data.append('function', 'subToUser');
      data.append('creator',  this.state.user.name);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data,
    })
    .then(response => response.json())
    .then(bool => {
        if (bool === 1) {
          this.setState({ subscribed: true });
        }
    });
  }

  unsubscribe() {
    let data = new FormData();
      data.append('function', 'unsubToUser');
      data.append('creator', this.state.user.name);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data,
    })
    .then(response => response.json())
    .then(bool => {
        if (bool === 1) {
          this.setState({ subscribed: false });
        }
    });
  }

  handleAliasChange(event) {
    this.setState({
      editAlias: event.target.value,
    });
  }

  handleColorChange(event) {
    this.setState({
      editColor: event.target.value,
      editColorValid: !(this.hexRegex.test(event.target.value)) && (event.target.value.length % 3 == 0),
    });
    console.log(event.target.value);
    console.log(!(this.hexRegex.test(event.target.value)));
  }

  handleBioChange(event) {
    this.setState({
      editBio: event.target.value,
    });
  }

  checkFileUploads() {
    var iconFileExists = (
      (document.getElementById('fileIcon')) &&
      (document.getElementById('fileIcon').files.length > 0)
    );
    if (iconFileExists !== this.state.editIconExists) {
      this.setState({ editIconExists: iconFileExists });
    }
    var bgFileExists = (
      (document.getElementById('fileBackground')) &&
      (document.getElementById('fileBackground').files.length > 0)
    );
    if (bgFileExists !== this.state.editBackgroundExists) {
      this.setState({ editBackgroundExists: bgFileExists });
    }
  }

  updateAlias() {
    let data = new FormData();
      data.append('function', 'newUserAlias');
      data.append('alias', this.state.editAlias);
      data.append('color', this.state.editColor);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data
    })
    .then(response => response.json())
    .then(bool => {
        if (bool === 1) {
          let newUser = {...this.state.user}
          newUser.alias = this.state.editAlias;
          newUser.color = this.state.editColor;
          this.setState({ user: newUser });
        }
    });
  }

  updateBio() {
    let data = new FormData();
      data.append('function', 'newUserBio');
      data.append('bio', this.state.editBio);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data,
    })
    .then(response => response.json())
    .then(bool => {
        if (bool === 1) {
          let newUser = {...this.state.user}
          newUser.bio = this.state.editBio;
          this.setState({ user: newUser });
        }
    });
  }

  updateIcon() {
    let data = new FormData();
      data.append("function", "newUserIcon");
      data.append("upload", document.getElementById('fileIcon').files[0]);
    //let data = {
    //  function: "newUserIcon",
    //  upload: document.getElementById('fileIcon').files[0]
    //};
    fetch(constants.API_URL, {
      method: 'POST',
      body: data
    })
    .then(response => response.text())
    .then(txt => {
      if (txt.charAt(0) !== '[') {
        let newUser = {...this.state.user}
        newUser.icon = txt;
        this.setState({ user: newUser });
      }
    });
  }

  updateBackground() {
    let data = new FormData();
      data.append("function", "newUserBackground");
      data.append("upload", document.getElementById('fileBackground').files[0]);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data
    })
    .then(response => response.text())
    .then(txt => {
      if (txt.charAt(0) !== '[') {
        let newUser = {...this.state.user}
        newUser.background = txt;
        this.setState({ user: newUser });
      }
    });
  }

  renderUpdateButton(condition, text, onclick) {
    if (condition) {
      return (<div className="editform_action" onClick={onclick}>{text}</div>);
    }
   }

  renderEditor() {
    if (this.state.editing) {
      return (
        <div syle={{display: "flex"}}>
          <div className="editform">

            <div className="editform_section">
              <div className="editform_label">
                Alias:
                <input
                  className="editform_input" type="text" id="txtAlias"
                  value={this.state.editAlias}
                  onChange={this.handleAliasChange}
                />
              </div>
              <div className="editform_label">
                Alias Color:
                <input
                  className="editform_input" style={{maxWidth: "200px", margin: "0px 10px"}} type="text" id="txtColor"
                  value={this.state.editColor}
                  onChange={this.handleColorChange}
                />
                <div className="colorpicker" style={{background: "#" + this.state.editColor}}/>
                {this.state.editColorValid ? null : <div style={{color: "#f00"}}>Please enter a valid hex color code.</div>}
              </div>
              {this.renderUpdateButton(this.state.editColorValid, "Update", () => this.updateAlias())}
            </div>

            <div className="editform_section">
              <div className="editform_label">
                Bio:
                <textarea
                  className="editform_input" style={{height: '72px'}} type="text" id="txtBio"
                  value={this.state.editBio}
                  onChange={this.handleBioChange}
                />
              </div>
              {(this.state.editBio.length <= 256)
                ? <div>{this.state.editBio.length}/256</div>
                : <div style={{color: "#f00"}}>{this.state.editBio.length}/256</div>
              }
              {this.renderUpdateButton((this.state.editBio.length <= 256), "Update", () => this.updateBio())}
            </div>

            <div className="editform_section">
              <div className="editform_label">
                Icon Image: <input type="file" id="fileIcon" />
              </div>
              {this.renderUpdateButton(this.state.editIconExists, "Update", () => this.updateIcon())}
            </div>

            <div className="editform_section" style={{borderBottom: "0px"}}>
              <div className="editform_label">
                Background Image: <input type="file" id="fileBackground" value={this.state.email} />
              </div>
              {this.renderUpdateButton(this.state.editBackgroundExists, "Update", () => this.updateBackground())}
            </div>

          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        {this.renderBackground()}
        {this.renderContents()}
      </div>
    );
  }
}


export default UserPage;
