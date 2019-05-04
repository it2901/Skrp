import React, { Component } from 'react'
import styled from 'styled-components'
import { Label, Input, Popup } from 'semantic-ui-react'

const Div = styled.div`
  margin: 60px;
  border-radius: 25px;
  display:flex;
  flex-direction:column;
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
        <Popup trigger={<Label pointing="below" htmlFor={this.props.name}> {this.props.name} </Label>} content='Add users to your feed' />
        <Input name={this.props.name} key={this.props.name} placeholder={this.props.parameter} onKeyPress={this.props.changeParameterValue} />
      </Div>
    )
  }
}

export default Parameters
