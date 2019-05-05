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
import React from 'react'
import {
  NavLink,
  HashRouter
} from 'react-router-dom'

import { slide as Menu } from 'react-burger-menu'

export default props => {
  return (

    <Menu outerContainerId="outerContainer">
      <HashRouter>
        <div>
          <h1>SKRP</h1>
          <ul className="header">
            <li className="menu-item" ><NavLink to="/tweakinput">Adjust parameters</NavLink></li>
            <li className="menu-item" ><NavLink to="/nodegraph">Network graph</NavLink></li>
            <li className="menu-item"><NavLink to="/log">Adaption log</NavLink></li>
            <li className="menu-item"><NavLink to="/">About</NavLink></li>
            <li className="menu-item"><NavLink to="/maps">Map</NavLink></li>
          </ul>
        </div>
      </HashRouter>
    </Menu>
  )
}
