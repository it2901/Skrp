import React, { Component } from 'react';
import NavBar from "./components/navbar"
import Home from "./components/test/Home"
import Contact from "./components/test/Contact"
import Stuff from "./components/test/Stuff"
import About from "./components/about"
import {
  Route,
  HashRouter
} from "react-router-dom";
import "./components/styles/navbar.css"
import "./components/styles/hashrouter.css"

class App extends Component {
  render() {
    return (
      <div className="App">
      <NavBar></NavBar>
      <HashRouter>
        <div className="SPA">
            <Route path="/"/>
            <Route path="/home" component={Home}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/contact" component={Contact}/>
            <Route path="/about" component={About}/>
          </div>
      </HashRouter>

      </div>
    );
  }
}

export default App;
