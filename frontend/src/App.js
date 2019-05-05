/*
This file is part of SKRP.

SKRP is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SKRP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with SKRP. If not, see <https://www.gnu.org/licenses/>.
*/
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
require('dotenv').config()

class App extends Component {
  render () {
    return (
      <div>
        {/* The Helmet gives a uniform color to the whole page. */}
        <Helmet>
          <style>{'body { background-color:#b8b7ad ; }'}</style>
        </Helmet>
        {/* This is the acctual components and navbar */}

        <div>
          <NavBar />
          <HashRouter>
            <div className="SKRP">
              <Switch>
                <Route path="/maps" component={Maps} />
                <Route path="/nodegraph" component={NodeGraph} />
                <Route path="/tweakinput" component={tweakInput} />
                <Route path="/log" component={Log} />
                <Route path="/" exact component={About} />
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
