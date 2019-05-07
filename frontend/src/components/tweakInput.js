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
      parameters: {} }

    this.props = props
  }

  componentWillMount () {
    this.setInitalState()
  }

  // fetches config from database and spreads it to the state.
  async setInitalState () {
    const stateToBe = await fetch('http://localhost:8090/configure').then(data => { return data.json() }).catch(err => console.error(err))
    let parameters = stateToBe['config']
    this.device_id = stateToBe['device_id']
    let p2 = { ...parameters }
    this.setState({
      parameters: p2 })
  }

  // Update the config in the database, this will trigger an adaptation. s
  sendToConfigure () {
    let body = this.state.parameters
    body['device_id'] = this.device_id
    fetch('http://localhost:8090/configure', {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json']],
      body: JSON.stringify(body) })
  }
  // Logs an adaptation to the system log
  sendToAdaptationLog (name, value) {
    let id = 2
    let description = `${name} has updated to ${value}`
    let statement = `http://localhost:8090/logadaption?adaption_type=${name}&device_id=${id}&description=${description}`
    fetch(statement, { method: 'POST' })
  }
  // Changes values on a spesific input field and logs the changed adaptation
  onChangeParameterValue (name, event) {
    let value = event.target.value
    if (event.key === 'Enter') {
      let parameters = this.state.parameters
      parameters[name] = value
      this.setState({
        parameters: parameters })

      setTimeout(() => {
        this.sendToConfigure()
        this.sendToAdaptationLog(name, value)
      }
      , 1)
    }
  }

  render () {
    let state = Object.entries(this.state.parameters)
    let parameters = state.map(s => {
      return <Parameters data-cy="submit" key={s[0]} changeParameterValue={this.onChangeParameterValue.bind(this, s[0])} parameter={s[1]} name ={s[0]}/>
    })

    return <div>
      <div> <p style ={{ 'textAlign': 'center' }}> Remember to input valid input in each field, they lack validation</p> </div>
      <Form className="flex-container">
        {parameters}
      </Form>
    </div>
  }
}

export default TweakInput
