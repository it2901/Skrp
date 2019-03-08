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
          <h1>Simple SPA</h1>
          <ul className="header">
            <li className="menu-item" ><NavLink to="/">Standard</NavLink></li>
            <li className="menu-item" ><NavLink to="/tweakinput">Tweak Input</NavLink></li>
            <li className="menu-item" ><NavLink to="/home">Home</NavLink></li>
            <li className="menu-item" ><NavLink to="/nodegraph">Node Graph</NavLink></li>
            <li className="menu-item"><NavLink to="/log">Log</NavLink></li>
            <li className="menu-item"><NavLink to="/about">About</NavLink></li>
            <li className="menu-item" ><NavLink to="/nodegraph">Node Graph</NavLink></li>
          </ul>
        </div>
      </HashRouter>
    </Menu>
  );
};