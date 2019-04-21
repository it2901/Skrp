import React, { Component } from 'react'
import image from '../assets/404.gif'

const size = {
  width: "100%"
  
}

class Errorcomponent extends Component {
  render () {
    return (
      <div style={size}>
        <img  style={size} src={image} alt="Logo" />
      </div>
    )
  }
}

export default Errorcomponent
