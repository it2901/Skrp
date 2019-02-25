import React from "react";
import {
    NavLink,
    HashRouter
  } from "react-router-dom";

import Home from "./test/Home"
import Stuff from "./test/Stuff"
import Contact from "./test/Contact"

import { slide as Menu } from "react-burger-menu";


export default props => {
  return (

    <Menu>  
    <HashRouter>
        <div>
          <h1>Simple SPA</h1>
          <ul className="header">
            <li className="menu-item" ><NavLink to="/">Home</NavLink></li>
            <li className="menu-item"><NavLink to="/stuff">Stuff</NavLink></li>
            <li className="menu-item"><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>
      </HashRouter>
    </Menu>
  );
};