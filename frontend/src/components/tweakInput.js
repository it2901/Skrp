import React, { Component } from 'react'
import Parameters from './parameter'
import styled from 'styled-components'

const Div = styled.div`
top-border: 50%;
display:flex;
flex-direction:row;
`

class TweakInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.props = props
  }

  componentWillMount(){
    this.setInitalState()
  }

  async setInitalState (){
    //let stateToBe = fetch("http://localhost:8090/configure").catch(err => console.error(err));
    //console.log([stateToBe.body,stateToBe.then(data=> console.log([data.data,JSON.parse(data.body)]))])
    const stateToBe = await fetch('http://localhost:8090/configure').then(data => { return data.json()
  }
)
delete stateToBe[0]['conf_id']
Object.entries(stateToBe[0]).map(p=>{
    this.setState({
      [p[0]]:p[1]
    })
})
  }
  
  sendToConfigure(parameter,value){
    fetch("http://localhost:8090/configure?",parameter,"=",value)
  }
  valdiator (value) {
    return value.match(/^[.0-9]*$/gm)
  }

    onChangeParameterValue(name, event){
      if (event.key === 'Enter' && this.valdiator(event.target.value) )  {
        this.setState({
          [name]: event.target.value
        })
        this.sendToConfigure(name,event.target.value)
      }
    }

   

    render () {
      let state = Object.entries(this.state)
      let parameters = state.map(s => {
        return <Parameters key={s[0]}changeParameterValue={this.onChangeParameterValue.bind(this, s[0])} parameter={s[1]} name ={s[0]}/>
      })
      return <Div>{parameters}</Div>
    }
}

export default TweakInput
