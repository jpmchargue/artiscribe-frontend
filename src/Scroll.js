import React, {Component} from 'react';

import constants from './constants';

import PostBlock from './PostBlock';
import UserBlock from './UserBlock';
import TopicBlock from './TopicBlock';
import SeriesBlock from './SeriesBlock';

// Scroll-specific constants
var LOAD_IF_WITHIN = 2000;
var LOAD_UP_TO = 5000;
var UNLOAD_AT = 7500;
var MIN_HEIGHTS = {
  post: 225,
  topic: 150,
  user: 150,
  series: 150,
}
var MAX_BLOCKS_PER_QUERY = 50;

// Array.from(document.querySelectorAll('.post'), (post) => post.clientHeight + 15)

class Scroll extends Component {
  constructor(props) {
    super(props);
    // REQUIRED PROPS
    // type       This can be 'post', 'user', 'topic', or 'series'. <Scroll/> uses this value to determine what types of divs it should display.
    // endpoint   A JSON object representing the API endpoint at which the source list can be found.
    // OPTIONAL PROPS
    // first      The index of the first item in the feed, if not 0.
    // y          The y position of Scroll's start, if significantly greater than 0.
    //              This isn't necessary for the functionality of Scroll, but it prevents unnecessary AJAX requests.
    let buildInventory = new Array(props.first);
    let buildHeights = new Array(props.first);
    buildInventory.fill(null);
    buildHeights.fill(0);

    this.state = {
      inventory: buildInventory,
      heights: buildHeights,
    }
    this.requested = new Set();
    this.needHeight = new Set();
    this.universalLimit = -1;
  }
  componentDidMount() {
    setInterval(() => this.maintain(), 250);
  }

  /*
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.inventory.length !== this.state.inventory.length) {
      return true;
    }
    for (var b = 0; b < nextState.inventory.length; b++) {
      if (nextState.inventory[b] !== this.state.inventory[b]) {
        return true;
      }
    }

    if (nextState.heights.length !== this.state.heights.length) {
      return true;
    }
    for (var b = 0; b < nextState.heights.length; b++) {
      if (nextState.heights[b] !== this.state.heights[b]) {
        return true;
      }
    }

    return false;
  }
  */

  indexAtY(ylist) {
    // y should be a list of y-positions on the page, in increasing order.
    // Returns a list of the block indices within which those y-positions fall.
    var indices = [];
    var acc = this.props.y;
    for (var i = this.props.first; i < this.state.heights.length; i++) {
      acc += this.state.heights[i];
      while (ylist[0] < acc) {
        indices.push(i);
        ylist.shift();
      }
    }
    // Guess the indices of y positions past the bottom of the feed
    for (var y of ylist) {
      let extras = Math.ceil((y - acc) / MIN_HEIGHTS[this.props.type]);
      indices.push(i + extras);
    }
    return indices;
  }

  isLoaded(index) {
    return (this.state.inventory[index]);
  }

  isRequested(index) {
    return (this.requested.has(index));
  }

  getExtremities() {
    var extremities = this.indexAtY([
      window.scrollY - LOAD_IF_WITHIN,
      window.scrollY + window.innerHeight + LOAD_IF_WITHIN
    ]);
    if (!(this.isLoaded(extremities[0])) && !(this.isRequested(extremities[0]))) {
      extremities[0] = this.indexAtY([window.scrollY - LOAD_UP_TO]);
    }
    extremities[0] = Math.min(this.state.inventory.length, extremities[0]);
    extremities[0] = Math.max(this.props.first, extremities[0]);
    if (!(this.isLoaded(extremities[1])) && !(this.isRequested(extremities[1]))) {
      extremities[1] = this.indexAtY([window.scrollY + window.innerHeight + LOAD_UP_TO]);
    }
    if (this.universalLimit !== -1) extremities[1] = Math.min(this.universalLimit, extremities[1]);
    console.log("Extremity Indices: " + extremities.toString());
    return extremities;
  }

  getRequestSet() {
    // Returns the set of indices for blocks that must be loaded.
    var ext = this.getExtremities();
    var toRequest = [];
    for (let v = ext[0]; v < ext[1]; v++) {
      if (!(this.isLoaded(v)) && !(this.isRequested(v))) {
        toRequest.push(v);
      }
    }
    console.log("Indices to request: " + toRequest.toString());
    return toRequest;
  }

  maintain() {
    // LOADING MISSING BLOCKS
    var requestSet = this.getRequestSet();
    if (requestSet.length > 0) {
      for (const r of requestSet) {
        this.requested.add(r);
      }
      var requestMin = Math.min.apply(null, requestSet);
      var requestMax = Math.max.apply(null, requestSet);
      let data = this.props.endpoint;
      data['index'] = requestMin;
      data['number'] = Math.min(MAX_BLOCKS_PER_QUERY, requestMax - requestMin + 1);
      console.log("requesting range with index " + data['index'].toString() + " and number " + data['number'].toString());
      fetch(constants.API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(blocks => {
        this.receive(blocks);
      });
    }

    // UNLOADING DISTANT BLOCKS
    var unloadBoundaries = this.indexAtY([
      window.scrollY - UNLOAD_AT,
      window.scrollY + window.innerHeight + UNLOAD_AT
    ]);
    const inventoryCopy = this.state.inventory.slice();
    var invUpdateNeeded = false;
    for (var n = 0; n < inventoryCopy.length; n++) {
      if (inventoryCopy[n] !== null) {
        if ((n < unloadBoundaries[0]) || (n > unloadBoundaries[1])) {
          inventoryCopy[n] = null;
          invUpdateNeeded = true;
        }
      }
    }

    // ENSURE HEIGHTS ACCURACY
    var heightsCopy = this.state.heights.slice();
    var heightUpdateNeeded = false;
    for (var i = 0; i < this.state.inventory.length; i++) {
      if (this.state.inventory[i]) {
        let targetDiv = document.getElementById(i.toString());
        if (targetDiv !== null) {
          let height = targetDiv.clientHeight + 15;
          if (height !== heightsCopy[i]) {
            heightsCopy[i] = height;
            heightUpdateNeeded = true;
          }
        }
      }
    }

    if (invUpdateNeeded || heightUpdateNeeded) {
      this.setState({
        inventory: inventoryCopy,
        heights: heightsCopy
      });
    }
  }

  receive(batch) {
    let batchHead = batch[0];
    let batchTail = batch[1];
    console.log("Receiving batch from " + batchHead.toString() + " to " + batchTail.toString());
    //console.log(batch);
    const inventoryCopy = this.state.inventory.slice();
    for (var b = batchHead; b < batchTail; b++) {
      if (this.isRequested(b)) {
        if (batch[2 + b - batchHead] !== undefined) {
          inventoryCopy[b] = batch[2 + b - batchHead];
          this.needHeight.add(b);
          this.requested.delete(b);
        } else {
          this.universalLimit = b;
          break;
        }
      }
    }
    this.setState({inventory: inventoryCopy});
  }


  componentDidUpdate() {
    // Record the heights of any blocks with indices in needHeight.
    // There's a more obscured way of doing this using isLoaded,
    // but this is way less complicated.
    if (this.needHeight.size > 0) {
      var heightsCopy = this.state.heights.slice();
      for (var i of this.needHeight) {
        let targetDiv = document.getElementById(i.toString());
        if (targetDiv !== null) {
          heightsCopy[i] = targetDiv.clientHeight + 15;
        }
        this.needHeight.delete(i);
      }
      this.setState({heights: heightsCopy});
    }
  }


  renderHeader() {
    return this.props.header;
  }

  renderBlocks() {
    let blocks = [];
    switch(this.props.type) {
      case 'post':
        var acc = this.props.y;
        for (var n = 0; n < this.state.inventory.length; n++) {
          if (this.state.inventory[n] !== null) {
            blocks.push(<PostBlock
              globals={this.props.globals}
              content={this.state.inventory[n]}
              position={acc}
              isVisible={!(this.needHeight.has(n))}
              blockID={n}
              key={n}
            />);
          }
          acc += this.state.heights[n];
        }
        break;
      case 'user':
        for (var n = 0; n < this.state.inventory.length; n++) {
          blocks.push(<UserBlock content={this.state.inventory[n]} key={n} />);
        }
        break;
      case 'topic':
        for (var n = 0; n < this.state.inventory.length; n++) {
          blocks.push(<TopicBlock content={this.state.inventory[n]} key={n} />);
        }
        break;
      case 'series':
        for (var n = 0; n < this.state.inventory.length; n++) {
          blocks.push(<SeriesBlock content={this.state.inventory[n]} key={n} />);
        }
        break;
    }
    return blocks;
  }

  render() {
    return (
      <div id="scroll_container">
        {this.renderHeader()}
        {this.renderBlocks()}
        <div id="scroll_bottom"></div>
      </div>
    );
  }
}


export default Scroll;
