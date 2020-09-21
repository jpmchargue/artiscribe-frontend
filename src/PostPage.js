import React, {Component} from 'react';

import constants from './constants';


class PostPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postid: window.location.href.split('/').slice(-1)[0],
      post: null,
      receivedData: false,
    };
  }

  componentDidMount() {
    let data = new FormData();
      data.append('function', 'getPost');
      data.append('id', this.state.postid);
    fetch(constants.API_URL, {
      method: 'POST',
      body: data,
    })
    .then(response => response.json())
    .then(received => {
      this.setState({
        post: received,
        receivedData: true,
      });
    });
  }

  renderPost() {
    return (
      <div style={{paddingTop: "70px"}}>
        {this.state.postid}<br/>
        {JSON.stringify(this.state.post)}
      </div>
    );
  }

  renderMissing() {
    return (
      <div className="page_wrapper">
        <div className="page_centered">
          <b>The post you were looking for couldn't be found!</b><br />
          It may have been deleted or unlisted by its creator.
        </div>
      </div>
    );
  }

  renderLoading() {
    return <div></div>;
  }

  render() {
    if (this.state.receivedData) {
      if (this.state.post !== null) {
        return this.renderPost();
      } else {
        return this.renderMissing();
      }
    } else {
      return this.renderLoading();
    }
  }
}


export default PostPage;
