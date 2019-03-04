import React, { Component } from 'react';
import NavBar from "./components/navbar"
import NodeGraph from "./components/NodeGraph"
import About from "./components/about"
import errorcomponent from "./components/errorcomponent"

import {
  Route,
  HashRouter,
  Switch
} from "react-router-dom";
import "./components/styles/navbar.css"
import "./components/styles/hashrouter.css"


class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar/>
          <HashRouter>
            <div className="SPA">
              <Switch>
                <Route path="/home" component={About}/>
                <Route path="/nodegraph" component={NodeGraph}/>
                <Route path="/about" component={About}/>
                <Route component={errorcomponent} />
              </Switch>
            </div>  
        </HashRouter>
      </div>
    );
  }
}

export default App;
