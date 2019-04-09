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
    padding: 10px 20px 0px 20px ;
    color:black;
    border-bottom:solid black;
    background-color: lightgrey;
    border-radius: 8px 8px 0px 0px;
    border-top: solid black;
`
const Input = styled.input`
    font-size:18pt;
    height:50px;
    width:200px;
    border: 4px;
    border-radius: 0px 0px 8px 8px;
    border-bottom: solid black;
    }
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
          <Label htmlFor={this.props.name}>{this.props.name} </Label>
          <Input name={this.props.name} key={this.props.key} placeholder={this.props.parameter} onKeyPress={this.props.changeParameterValue} />
      </Div>
    )
  }
}

export default Parameters
