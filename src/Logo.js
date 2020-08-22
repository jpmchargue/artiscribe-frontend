import React from 'react';
import {Link} from "react-router-dom";

import inkwell from './inkwell.svg';


const Logo = () => {
  return (
    <div id="logo_container">
      <Link to="" title="Artiscribe Home" id="logo_link">
        <img src={inkwell} id="logo" height="48"/>
      </Link>
    </div>
  );
}


export default Logo;
