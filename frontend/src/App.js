import React, { Component } from 'react';
import NavBar from "./components/navbar"
import Home from "./components/test/Home"
import Contact from "./components/test/Contact"
import Stuff from "./components/test/Stuff"
import About from "./components/about"
import errorcomponent from "./components/errorcomponent"
import tweakInput from "./components/tweakInput"
import styled from "styled-components"
import {Helmet} from 'react-helmet';

import NodeGraph from "./components/NodeGraph"
import {
  Route,
  HashRouter,
  Switch
} from "react-router-dom";
import "./components/styles/navbar.css"
import "./components/styles/hashrouter.css"

const Div = styled.div`
height: 100%;
width:100%;
color:white;
`;

class App extends Component {
  render() {
    return (
      <div>
        {/* The Helmet gives a uniform color to the whole page. */}
      <Helmet>
      <style>{'body { background-color: black; }'}</style>
    </Helmet>
    {/* This is the acctual components and navbar*/}

      <Div>
        <NavBar/>
          <HashRouter>
            <div className="SPA">
              <Switch>
                <Route path="/home" component={About}/>
                <Route path="/tweakinput" component={tweakInput}/>
                <Route path="/nodegraph" component={NodeGraph}/>
                <Route path="/about" component={About}/>
                <Route path="/nodegraph" component={NodeGraph}></Route>
                <Route component={errorcomponent} />
              </Switch>
            </div>  
        </HashRouter>
        </Div>
        </div>
    );
  }
}

export default App;
