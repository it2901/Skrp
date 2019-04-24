import React, { Component } from 'react'
import NavBar from './components/navbar'
import NodeGraph from './components/nodegraph'
import About from './components/about'
import Log from './components/log'
import Maps from './components/maps'
import errorcomponent from './components/errorcomponent'
import tweakInput from './components/tweakInput'
import { Helmet } from 'react-helmet'
import {
  Route,
  HashRouter,
  Switch
} from 'react-router-dom'
import './components/styles/navbar.css'
import './components/styles/hashrouter.css'
import './components/styles/react-datetime.css'

class App extends Component {
  render () {
    return (
      <div>
        {/* The Helmet gives a uniform color to the whole page. */}
        <Helmet>
          <style>{'body { background-color:white ; }'}</style>
        </Helmet>
        {/* This is the acctual components and navbar */}

        <div>
          <NavBar />
          <HashRouter>
            <div className="SKRP">
              <Switch>
                <Route path="/tweakinput" component={tweakInput} />
                <Route path="/nodegraph" component={NodeGraph} />
                <Route path="/about" component={About} />
                <Route path="/log" component={Log} />
                <Route path="/maps" component={Maps} />
                <Route component={errorcomponent} />
              </Switch>
            </div>
          </HashRouter>
        </div>
      </div>
    )
  }
}

export default App
