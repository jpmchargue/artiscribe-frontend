import React, { Component } from 'react';


class ErrorPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>That page couldn't be found!<br/>It may have been moved or deleted.</div>;
  }
}


export default ErrorPage;
