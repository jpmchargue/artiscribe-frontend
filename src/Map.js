import React, {Component} from 'react';


class Map extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{display: 'flex', height: '100vh'}}>
        <div style={{margin: 'auto', textAlign: 'center'}}>
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand+SC&display=swap" rel="stylesheet"/>
          <div style={{fontFamily: 'Patrick Hand SC, cursive', fontSize: '60px'}}>
            artiscribe map
          </div>
          An expansive world map that anyone can edit, one day at a time.<br />
          In essence, this will be a larger, slower version of Reddit's r/place, designed as a fun way to discover new creators.<br />
          Artiscribe Map will not be available until late in Artiscribe's development.<br />
        </div>
      </div>
    );
  }
}


export default Map;
