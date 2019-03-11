import React, { Component } from 'react'
import MDReactComponent from 'markdown-react-js';




class About extends Component {
  render() {
    return (
      <MDReactComponent text='Some text **with emphasis**.' />   
    );
  }}
  
export default About
