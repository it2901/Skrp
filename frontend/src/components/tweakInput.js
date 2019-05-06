import React, { Component } from 'react'
import Parameters from './parameter'
import styled from 'styled-components'
import curl from 'curl'

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
    this.device_id = stateToBe['device_id']
    // this is not allowed, plz fix me.
    // This might trigger alot of state updates
    let parameter = {}
    Object.entries(parameters).map(p => (
      parameter[p[0]] = p[1])
    )
    this.setState({
      parameters: parameter
    })
  }

  // new Send to Configuration Endpoint
  sendToConfigure () {
    let body = this.state.parameters
    body['device_id'] = this.device_id
    console.log(JSON.stringify(body))
    fetch('http://localhost:8090/configure', {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json']
      ],
      body: JSON.stringify(body)
    })
  }

  sendToAdaptation (name, value) {
    let id = 2
    let description = `parameter ${name} has been changed to ${value}`
    let statement = `http://localhost:8090/logadaption?adaption_type=${name}&device_id=${id}&description=${description}`
    fetch(statement, { method: 'POST' })
  }

  onChangeParameterValue (name, event) {
    let value = event.target.value
    if (event.key === 'Enter') {
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
