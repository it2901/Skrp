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
import styled from 'styled-components'
import { Label, Input, Popup } from 'semantic-ui-react'

const Div = styled.div`
  margin: 60px;
  border-radius: 25px;
  display:flex;
  flex-direction:column;
  font-size:125%;
`
class Parameters extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      'value': this.props.parameter
    }
  }

  render () {
    return (
      <Div>
        <Popup trigger={<Label pointing="below" htmlFor={this.props.name}> {this.props.name} </Label>} content='Description...' />
        <Input name={this.props.name} key={this.props.name} placeholder={this.props.parameter} onKeyPress={this.props.changeParameterValue} />
      </Div>
    )
  }
}

export default Parameters
