import React, { Component } from 'react';
import NavBar from "./components/navbar"
import NodeGraph from "./components/NodeGraph"
import {
  Route,
  HashRouter
} from "react-router-dom";
import "./components/styles/navbar.css"
import "./components/styles/hashrouter.css"


class App extends Component {
  render() {
    return (
      <div className="App" id="outerContainer"> 
      <NavBar></NavBar>
      <HashRouter>
        <div className="SPA">
            <Route path="/nodegraph" component={NodeGraph}></Route>
          </div>
      </HashRouter>

      </div>
    );
  }
}

export default App;
