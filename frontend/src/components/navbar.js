import React from "react";
import {
    NavLink,
    HashRouter
  } from "react-router-dom";

import { slide as Menu } from "react-burger-menu";


export default props => {
  return (

    <Menu outerContainerId="outerContainer">  
    <HashRouter>
        <div>
          <h1>SKRP</h1>
          <ul className="header">
            <li className="menu-item" ><NavLink to="/">Standard</NavLink></li>
            <li className="menu-item" ><NavLink to="/tweakinput">Adjust parameters</NavLink></li>
            <li className="menu-item" ><NavLink to="/home">Home</NavLink></li>
            <li className="menu-item" ><NavLink to="/nodegraph">Network graph</NavLink></li>
            <li className="menu-item"><NavLink to="/log">Adaption log</NavLink></li>
            <li className="menu-item"><NavLink to="/about">About</NavLink></li>
          </ul>
        </div>
      </HashRouter>
    </Menu>
  );
};