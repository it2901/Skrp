import React, { Component } from 'react'
import image from '../assets/404.gif'

class Errorcomponent extends Component {
  render () {
    return (
      <div>
        <img src={image} alt="Logo" />
      </div>
    )
  }
}

export default Errorcomponent
