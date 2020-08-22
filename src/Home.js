import React, {Component} from 'react';

import constants from './constants';

import PostBlock from './PostBlock';
import Scroll from './Scroll';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topThree: [],
      receivedData: false,
    }
  }

  componentDidMount() {
    let data = {
      function: 'getPosts',
      index: 0,
      number: 3,
    }
    fetch(constants.API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(posts => {
      this.setState({
        topThree: posts.slice(2)
      });
    })
  }

  renderTop() {
    var posts = [];
    for (var n = 0; n < this.state.topThree.length; n++) {
      posts.push(<PostBlock content={this.state.topThree[n]} key={n} />);
    }
    return <div className="post_container">{posts}</div>
  }

  render() {
    return (
      <div id="central_biased">
        <div className="central_contents">
          <div className="posts_top">
            <div style={{height:"300px", width:"500px", background:"#adadc2"}}>
              The <b>*JP Brand Infinitely-Scrolling Feed*</b><br />
              Now with <i>randomly generated content</i> for a truly endless stream of unique entertainment!
            </div>
          </div>
          <Scroll
            type="post"
            endpoint={{function: 'dummyPosts'}}
            first={3}
            y={400}
          />
        </div>
      </div>
    );
  }
}


export default Home;
