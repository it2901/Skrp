/*
This file is part of SKRP.

SKRP is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SKRP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with SKRP. If not, see <https://www.gnu.org/licenses/>.
*/
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
      linkSelected: false,
      data: false,
      info: false,
      config: {
        directed: false,
        height: window.innerHeight,
        width: window.innerWidth,
        nodeHighlightBehavior: true,
        linkHighlightBehavior: true,
        highlightOpacity: 0.2,
        node: {
          color: '#888',
          fontSize: 10,
          highlightColor: 'red',
          highlightFontSize: 14,
          highlightFontWeight: 'bold',
          highlightStrokeColor: 'red',
          highlightStrokeWidth: 1.5,
          renderLabel: true,
          labelProperty: 'label'
        },
        link: {
          strokeWidth: 3
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

    this.config.updateFrequency = (config.NODE_GRAPH_UPDATE_FREQUENCY === 0 || config.NODE_GRAPH_UPDATE_FREQUENCY === undefined) ? config.GLOBAL_UPDATE_FREQUENCY : config.NODE_GRAPH_UPDATE_FREQUENCY
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
    let xhttp = new XMLHttpRequest({ mozSystem: true })
    let self = this
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        // Setstate
        self.processData(JSON.parse(xhttp.responseText).collection[self.config.NODE_GRAPH_PATH].collection[0])
        // self.setState({ data: JSON.parse(xhttp.responseText) })
      } else if (this.readyState === 4 && this.status === 404) {
        // no results

        self.setState({ data: {} })
      }
    }
    xhttp.open('GET', this.config.NODE_GRAPH, true)
    xhttp.send()
  }
  mapValue=(v, s1, e1, s2, e2) => {
    e1 = this.ensureBigger(s1, e1)
    return Math.ceil((v - s1) / (e1 - s1) * (e2 - s2) + s2)
  }
  ensureBigger=(a, b) => (a < b) ? 0 : a + 1
  processData (data) {
    // ensures no dupes
    let nodes = data.nodes.filter((v, i, a) => a.indexOf(v) === i)
    // map min and max value of nodes to HSL color spectrum
    let linkMin = this.config['MIN_THRESHOLD'] || data.links.reduce((a, b) => a.cost > b.cost ? b : a).cost
    let linkMax = this.config['MAX_THRESHOLD'] || data.links.reduce((a, b) => a.cost < b.cost ? b : a).cost

    let links = data.links
      .map(e => Object.assign(
        { color: `hsl(${this.mapValue(e.cost, linkMin, linkMax, 120, 0)},100%,66%)` }
        , e))
    delete data.nodes
    delete data.links

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
    const onClickLink = (source, target) => {
      let d = this.state.data.links
        .filter(i => i.source === source && i.target === target)[0]
      if (d.properties && Object.entries(d.properties).length === 0) {
        delete d.properties
      }
      this.setState({ linkSelected: d })
    }
    // return (
    // <div style={{ height: '100vh', position: 'absolute', width: '100vw', left: 0, right: 0 }}>
    /* <iframe src="http://localhost:3000/graph/visualizer.html" title="Nodegraph" height="100%" width="100%"></iframe> */
    /* </div> */
    // )
    return (
      <div>
        <div style={{ position: 'absolute', top: '3%', right: '2%', display: 'flex', flexDirection: 'column' }}>
          <Message
            warning
            style={{ width: '200px' }}
            content='Link color represents the link cost between the min
          and max tresholds set in the config.
          Where green is low and red is high.'/>
          {!!this.state.info &&
              <Message style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.keys(this.state.info).map(i => {
                  return <span key={i}><strong>{i}</strong>: {this.state.info[i]}</span>
                })}
              </Message>
          }
          {this.state.nodeSelected &&
          <Message style={{ display: 'flex', flexDirection: 'column' }} onDismiss={() => this.setState({ nodeSelected: false })}>
            <span><strong>id:</strong> {this.state.nodeSelected}</span>
            <span><strong>links:</strong> {this.getLinks(this.state.nodeSelected)}</span>
            <span>Other info:</span>
            {
              this.state.data.nodes.filter(i => i.id === this.state.nodeSelected).map((v) => {
                return Object.keys(v).filter(i => i !== 'id').map(i => {
                  return <span key={i}><strong>{i}: </strong>{v[i]}</span>
                })
              })
            }

          </Message>
          }
          {this.state.linkSelected &&
          <Message style={{ display: 'flex', flexDirection: 'column' }} onDismiss={() => this.setState({ linkSelected: false })}>
            {Object.keys(this.state.linkSelected)
              .map((i) => {
                return <span key={i}><strong>{i}: </strong>{this.state.linkSelected[i]}</span>
              })}
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

        { !!this.state.data &&
            <Graph
              style={{ border: '1px solid black' }}
              id="networkgraph"
              data={this.state.data}
              onClickNode={onClickNode}
              onClickLink={onClickLink}
              config={this.state.config}
            />
        }
      </div>
    )
  }
}

export default NodeGraph
