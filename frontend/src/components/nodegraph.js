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
    // fetches on mount
    this.setConfig().then(res => {
      this.fetch()
    }
    )
  }
  async setConfig () {
    // GETs the local config.JSON and sets it to state
    const config = await fetch('config.JSON').then(data => data.json()).catch(err => console.error(err))
    this.config = config

    this.config.updateFrequency = (config.NODE_GRAPH_UPDATE_FREQUENCY === 0 || config.NODE_GRAPH_UPDATE_FREQUENCY === undefined) ? config.GLOBAL_UPDATE_FREQUENCY : config.NODE_GRAPH_UPDATE_FREQUENCY
  }

  change () {
    // on click handler for live update button
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
        // console.log(JSON.parse(xhttp.responseText))

        // self.processData(JSON.parse(xhttp.responseText).collection[0])
      } else if (this.readyState === 4 && this.status === 404) {
        // no results

        self.setState({ data: {} })
      }
    }
    let url = document.URL.split(':3000')[0]
    xhttp.open('GET', `${url}:8090/rawnetwork`, true)
    // xhttp.open('GET', 'http://localhost:3001/netgph', true)
    xhttp.send()
  }
  mapValue=(value, vmin, vmax, tmin, tmax) => {
    // function to to map a value between vmin and vmax to values between tmin and tmax
    return vmin === vmax ? tmin : Math.ceil((value - vmin) / (vmax - vmin) * (tmax - tmin) + tmin)
  }
  processData (data) {
    if (!data) return
    // ensures no dupes,
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
    // no precalculation, this happens every time you click a NODE
    // gives out link length
    return this.state.data.links.filter(e => e.source === nodeId || e.target === nodeId).length
  }
  render () {
    const onClickNode = (nodeId) => {
      // happens every time you click a node
      this.setState({ nodeSelected: nodeId })
    }
    const onClickLink = (source, target) => {
      // dumps out link info when clicked
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
