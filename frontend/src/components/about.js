import React, { Component } from 'react'
import MDReactComponent from 'markdown-react-js';
import styled from 'styled-components';
import localmain from "../assets/docs/main.txt"
import localbackend from "../assets/docs/backend.md"
import localfrontend from "../assets/docs/frontend.md"
import localmocker from "../assets/docs/mocker.md"

fetch(localmain).then(data => {console.log(data.text())})
const Div = styled.div`
position: relative;
left:12.5%;
border-color:black;
border-style: solid;
border-radius:10px;
background-color:lightgrey;
width: 75%;
margin: 20px;
padding:20px;
`




class About extends Component {
  constructor() {
    super()
  this.state = {
    main: "localmain",
    backend: "localbackend",
    mocker: "localmocker",
    frontend:"localfrontend"
  }
}

  componentWillMount(){
    this.setOfflineState()
    this.setOnlineState()
  }

  async setOfflineState() {
    const main = await fetch(localmain).then(data => {return data.text()})
    const backend = await fetch(localbackend).then(data => {return data.text()})
    const frontend = await fetch(localfrontend).then(data => {return data.text()})
    const mocker = await fetch(localmocker).then(data => {return data.text()})
    this.setState({
      main: main,
      backend:backend,
      frontend:frontend,
      mocker:mocker
    })


  }

  async setOnlineState() {
    const main = await fetch("https://raw.githubusercontent.com/it2901/Skrp/develop/README.md").then(data => {return data.text()})
    const backend = await fetch("https://raw.githubusercontent.com/it2901/Skrp/develop/backend/README.md").then(data => {return data.text()})
    const frontend = await fetch("https://raw.githubusercontent.com/it2901/Skrp/develop/frontend/README.md").then(data => {return data.text()})
    const mocker = await fetch("https://raw.githubusercontent.com/it2901/Skrp/develop/mocker/README.md").then(data => {return data.text()})
    this.setState({
      main: main,
      backend:backend,
      frontend:frontend,
      mocker:mocker
    })


  }
  render() {
    return (
      <div> 
        <h1 style={{textAlign:"center"}}>Main</h1>
    <Div>
      <br></br>
      <MDReactComponent text={this.state.main}/>
    </Div>
    <h1 style={{textAlign:"center"}}>Backend</h1>
    <Div>
      <br></br>
      <MDReactComponent text={this.state.backend}/> 
    </Div>
    <h1 style={{textAlign:"center"}}>Mocker</h1>
    <Div>
      <br></br>
      <MDReactComponent text={this.state.mocker}/>
    </Div> 
    <h1 style={{textAlign:"center"}}>Frontend</h1>
    <Div>
      <br></br>
      <MDReactComponent text={this.state.frontend}/> 
    </Div>  
      </div>
    );
  }}
  
export default About
