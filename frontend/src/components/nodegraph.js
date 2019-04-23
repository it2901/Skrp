import React, { Component } from 'react'
import { Graph } from 'react-d3-graph'

class NodeGraph extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      liveUpdate: true,
      liveUpdater: 0,
      data: {
        // dårlig lib loool
        nodes: [],
        links: []
      },
      config: {
        'automaticRearrangeAfterDropNode': true,
        'collapsible': true,
        'directed': true,
        'focusAnimationDuration': 0.75,
        'focusZoom': 1,
        'height': 400,
        'highlightDegree': 2,
        'highlightOpacity': 0.2,
        'linkHighlightBehavior': true,
        'maxZoom': 12,
        'minZoom': 0.05,
        'nodeHighlightBehavior': true,
        'panAndZoom': false,
        'staticGraph': false,
        'width': 800,
        'd3': {
          'alphaTarget': 0.05,
          'gravity': -250,
          'linkLength': 120,
          'linkStrength': 2
        },
        'node': {
          'color': '#d3d3d3',
          'fontColor': 'black',
          'fontSize': 10,
          'fontWeight': 'normal',
          'highlightColor': 'red',
          'highlightFontSize': 14,
          'highlightFontWeight': 'bold',
          'highlightStrokeColor': 'red',
          'highlightStrokeWidth': 1.5,
          'mouseCursor': 'crosshair',
          'opacity': 0.9,
          'renderLabel': true,
          'size': 200,
          'strokeColor': 'none',
          'strokeWidth': 1.5,
          'svg': '',
          'symbolType': 'circle'
        },
        'link': {
          'color': 'lightgray',
          'fontColor': 'black',
          'fontSize': 8,
          'fontWeight': 'normal',
          'highlightColor': 'red',
          'highlightFontSize': 8,
          'highlightFontWeight': 'normal',
          'labelProperty': 'label',
          'mouseCursor': 'pointer',
          'opacity': 1,
          'renderLabel': false,
          'semanticStrokeWidth': true,
          'strokeWidth': 3
        }
      }
    }
  }
  componentDidMount () {
    this.fetch()
  }


  change () {
    let liveUpdater = this.state.liveUpdater
      if (this.state.liveUpdate){
          liveUpdater = setInterval(() => {
          this.fetch()
        }, 5000);
       this.setState({
         liveUpdater:liveUpdater
       })
      }
      else{
        clearInterval(this.state.liveUpdater)
        this.setState({
          liveUpdater:0
        })
      }
  }

  fetch () {
    console.log('fetched')

    let xhttp = new XMLHttpRequest({ mozSystem: true })
    let self = this
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Setstate
        self.processData(JSON.parse(xhttp.responseText))
        // self.setState({ data: JSON.parse(xhttp.responseText) })
      } else if (this.readyState === 4 && this.status === 404) {
        // no results
        console.log('no resultsssss!')
        
        self.setState({ data: {
          nodes: [],
          links: []
          // links: []
        } })
      }
    }
    xhttp.open('GET', 'http://localhost:3001/netgph', true)
    xhttp.send()
  }
  processData (data) {
    let nodes = data.nodes
    let nodeIds = nodes.map(e => e.id)
    let links = data.links.filter(e => {
      return nodeIds.includes(e.source) && nodeIds.includes(e.target)
    })
    console.log(links)

    let info = {
      type: data.type,
      protocol: data.protocol,
      version: data.version,
      metric: data.metric
    }
    this.setState({
      data: {
        nodes: nodes,
        links: links
        // links: []
      },
      info: info
    })
  }
  render () {
    // return (
    // <div style={{ height: '100vh', position: 'absolute', width: '100vw', left: 0, right: 0 }}>
    /* <iframe src="http://localhost:3000/graph/visualizer.html" title="Nodegraph" height="100%" width="100%"></iframe> */
    /* </div> */
    // )
    return (
      <div>
        <button onClick={() =>{
          this.setState(prevState => ({
          liveUpdate: !prevState.liveUpdate
        }))
        this.change()
      }

          }> Hey</button>

        { this.state.data.nodes.length &&
        <Graph
          style={{ border: '1px solid black' }}
          id="networkgraph"
          data={this.state.data}
          // config={this.state.config}
          config={{
            directed: true,
            height: window.innerHeight,
            width: window.innerWidth,
            nodeHighlightBehavior: true,
            highlightOpacity: 0.2,
            node: {
              color: 'blue',
              fontSize: 10,
              highlightColor: 'red',
              highlightFontSize: 14,
              highlightFontWeight: 'bold',
              highlightStrokeColor: 'red',
              highlightStrokeWidth: 1.5
            }
          }}
        />}
      </div>
    )
  }
}

export default NodeGraph
