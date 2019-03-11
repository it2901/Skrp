import React, { Component } from 'react'

class NodeGraph extends Component {
  constructor (props) {
    super(props)

    this.props = props
  }
  render () {
    return (
      <div style={{ height: '100vh', position: 'absolute', width: '100vw', left: 0, right: 0 }}>
        <iframe src="http://localhost:3000/graph/visualizer.html" title="Nodegraph" height="100%" width="100%"></iframe>
      </div>
    )
  }
}

export default NodeGraph
