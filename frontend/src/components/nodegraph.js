import React, { Component } from 'react'
import { Graph } from 'react-d3-graph'
import { Button, Message } from 'semantic-ui-react'

class NodeGraph extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.config = {}
    this.state = {
      liveUpdate: true,
      liveUpdater: 0,
      nodeSelected: false,
      data: {},
      info: {},
      config: {
        directed: false,
        height: window.innerHeight,
        width: window.innerWidth,
        nodeHighlightBehavior: true,
        highlightOpacity: 0.2,
        node: {
          color: '#888',
          fontSize: 10,
          highlightColor: 'red',
          highlightFontSize: 14,
          highlightFontWeight: 'bold',
          highlightStrokeColor: 'red',
          highlightStrokeWidth: 1.5
        }
      }
    }
  }
  componentDidMount () {
    this.setConfig().then(res => {
      this.fetch()
    }
    )
  }
  async setConfig () {
    const config = await fetch('config.JSON').then(data => data.json()).catch(err => console.error(err))
    this.config = config
    this.config.updateFrequency = (config.REACT_APP_NODE_GRAPH_UPDATE_FREQUENCY === 0 || config.REACT_APP_NODE_GRAPH_UPDATE_FREQUENCY === undefined) ? config.REACT_APP_GLOBAL_UPDATE_FREQUENCY : config.REACT_APP_NODE_GRAPH_UPDATE_FREQUENCY
  }

  change () {
    let liveUpdater = this.state.liveUpdater
    if (this.state.liveUpdate) {
      liveUpdater = setInterval(() => {
        this.fetch()
      }, this.config.updateFrequency)
      this.setState({
        liveUpdater: liveUpdater
      })
    } else {
      clearInterval(this.state.liveUpdater)
      this.setState({
        liveUpdater: 0
      })
    }
  }

  fetch () {
    console.log(this.config)
    let xhttp = new XMLHttpRequest({ mozSystem: true })
    let self = this
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Setstate

        self.processData(JSON.parse(xhttp.responseText)['collection'][0])
        // self.setState({ data: JSON.parse(xhttp.responseText) })
      } else if (this.readyState === 4 && this.status === 404) {
        // no results

        self.setState({ data: {} })
      }
    }
    xhttp.open('GET', this.config.REACT_APP_NETWORK_GRAPH, true)
    xhttp.send()
  }
  mapValue=(v, s1, e1, s2, e2) => (v - s1) / (e1 - s1) * (e2 - s2) + s2
  processData (data) {
    // ensures no dupes
    let nodes = data.nodes.filter((v, i, a) => a.indexOf(v) === i)
    // map min and max value of nodes to HSL color spectrum
    let linkMin = this.config['MIN_TRESHOLD'] || data.links.reduce((a, b) => a.cost > b.cost ? b : a).cost
    let linkMax = this.config['MAX_TRESHOLD'] || data.links.reduce((a, b) => a.cost < b.cost ? b : a).cost
    let links = data.links
      .map(e => Object.assign(
        { color: `hsl(${this.mapValue(e.cost, linkMin, linkMax, 120, 0)},100%,66%)` }
        , e))
    delete data.nodes
    delete data.links
    console.log(data)
    console.log(nodes)

    this.setState({
      data: { nodes: nodes, links: links },
      info: data
    })
  }
  getLinks (nodeId) {
    // not making a dict cause mocker has duplicate values xx
    return this.state.data.links.filter(e => e.source === nodeId || e.target === nodeId).length
  }
  render () {
    const onClickNode = (nodeId) => {
      this.setState({ nodeSelected: nodeId })
    }
    // return (
    // <div style={{ height: '100vh', position: 'absolute', width: '100vw', left: 0, right: 0 }}>
    /* <iframe src="http://localhost:3000/graph/visualizer.html" title="Nodegraph" height="100%" width="100%"></iframe> */
    /* </div> */
    // )
    return (
      <div>
        <div style={{ position: 'absolute', top: '3%', right: '2%', display: 'flex', flexDirection: 'column' }}>
          {!!this.state.info &&
              <Message style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.keys(this.state.info).map(i => {
                  return <span><strong>{i}</strong>: {this.state.info[i]}</span>
                })}
              </Message>
          }
          {this.state.nodeSelected &&
          <Message style={{ display: 'flex', flexDirection: 'column' }}>
            <span><strong>id:</strong> {this.state.nodeSelected}</span>
            <span><strong>links:</strong> {this.getLinks(this.state.nodeSelected)}</span>
          </Message>
          }
          <Button
            style={{
              background: this.state.liveUpdate ? 'red' : 'green',
              color: 'white'
            }}
            fluid
            content={'Live Update: ' + (this.state.liveUpdate ? 'OFF' : 'ON') }
            onClick={() => {
              this.setState(prevState => ({
                liveUpdate: !prevState.liveUpdate
              }))
              this.change()
            }}
          />

        </div>

        { !!this.state.data.nodes &&
            <Graph
              style={{ border: '1px solid black' }}
              id="networkgraph"
              data={this.state.data}
              onClickNode={onClickNode}
              config={this.state.config}
            />
        }
      </div>
    )
  }
}

export default NodeGraph
