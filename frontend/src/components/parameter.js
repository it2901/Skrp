import React, { Component } from 'react'
import styled from 'styled-components'

const Div = styled.div`
  margin: 60px;
  border: 10px solid black;
  border-radius: 25px;
`
const Label = styled.label`
    display: block; 
    font-size:14pt;
    height:50px;
    width:200px;
    width: auto;
    color:black;
`
const Input = styled.input`
    font-size:18pt;
    height:50px;
    width:200px;
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
        <form>
          <Label for={this.props.name}>{this.props.name} </Label>
          <Input placeholder={this.props.parameter} onKeyPress={this.props.changeParameterValue}/>
        </form>
      </Div>
    )
  }
}

export default Parameters
