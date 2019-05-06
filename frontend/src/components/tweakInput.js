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
import Parameters from './parameter'
import styled from 'styled-components'

const Form = styled.form`
padding: 80px
display:flex;
flex-direction:row;
flex-wrap: wrap;
`

class TweakInput extends Component {
  constructor (props) {
    super(props)
    this.device_id = {}
    this.state = {
      parameters: {}
    }
    this.props = props
  }

  componentWillMount () {
    this.setInitalState()
  }

  async setInitalState () {
    const stateToBe = await fetch('http://localhost:8090/configure').then(data => { return data.json() }).catch(err => console.error(err))
    let parameters = stateToBe['config']
    let deviceId = stateToBe['device_id']
    this.device_id = deviceId
    let parametersObject = {}

    Object.entries(parameters).forEach(p => (parametersObject[p[0]] = p[1]))
    this.setState({
      parameters: parametersObject
    })
  }

  // new Send to Configuration Endpoint
  sendToConfigure () {
    let body = this.state.parameters
    body['device_id'] = this.device_id
    fetch('http://localhost:8090/configure', {
      'method': 'POST',
      'mode': 'no-cors',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': JSON.stringify(body)
    })
  }

  sendToAdaptation (name, value) {
    let id = this.device_id
    let description = `parameter ${name} has been changed to ${value}`
    let statement = `http://localhost:8090/logadaption?adaption_type=${'compress'}&device_id=${id}&description=${description}`
    fetch(statement, { method: 'POST' })
  }
  valdiator (value) {
    return value.match(/^(0(\.\d+)?|[0-9]+)$/)
  }

  onChangeParameterValue (name, event) {
    let value = event.target.value
    if (event.key === 'Enter' && this.valdiator(value)) {
      let parameters = this.state.parameters
      parameters[name] = value
      this.setState({
        parameters: parameters
      })
      setTimeout(() => {
        this.sendToConfigure()
        this.sendToAdaptation(name, value)
      }, 1)
    }
  }

  render () {
    let state = Object.entries(this.state.parameters)
    let parameters = state.map(s => {
      return <Parameters data-cy="submit" key={s[0]} changeParameterValue={this.onChangeParameterValue.bind(this, s[0])} parameter={s[1]} name ={s[0]}/>
    })
    return <div>
      <Form className="flex-container">
        {parameters}
      </Form>
    </div>
  }
}

export default TweakInput
