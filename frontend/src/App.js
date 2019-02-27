import React, { Component } from 'react';
import NavBar from "./components/navbar"
import Home from "./components/test/Home"
import Contact from "./components/test/Contact"
import Stuff from "./components/test/Stuff"
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
            <Route path="/home" component={Home}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/contact" component={Contact}/>
          </div>
      </HashRouter>

      </div>
    );
  }
}

export default App;
