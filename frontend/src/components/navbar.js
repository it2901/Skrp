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
import { Icon } from 'semantic-ui-react'
import { slide as Menu } from 'react-burger-menu'

export default props => {
  return (

    <Menu outerContainerId="outerContainer">
      <HashRouter>
        <div>
          <h1>SKRP <a href='https://github.com/it2901/Skrp' target="_blank" rel="noopener noreferrer"><Icon name='github'/></a></h1>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <NavLink className="menu-item" to="/maps"><Icon name='map marker alternate'/>Map</NavLink>
            <NavLink className="menu-item" to="/nodegraph"><Icon name='sitemap'/>Network graph</NavLink>
            <NavLink className="menu-item" to="/log"><Icon name='book'/>Adaption log</NavLink>
            <NavLink className="menu-item" to="/tweakinput"><Icon name='settings'/>Adjust parameters</NavLink>
            <NavLink className="menu-item" exact to="/"><Icon name='info'/>About</NavLink>
          </div>

        </div>
      </HashRouter>
    </Menu>
  )
}
