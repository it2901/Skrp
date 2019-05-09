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
import { Map, TileLayer, Marker, Popup, FeatureGroup, Circle, Polyline } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import Control from 'react-leaflet-control'
import { Button } from 'semantic-ui-react'

export default class Maps extends Component {
  constructor () {
    super()
    this.state = {
      key: 0,
      bound: [[0, 1], [1, 2]],
      adjustView: true,
      updaters: [],
      liveUpdate: true,
      liveUpdater: 0,
      lat: 52.5,
      lng: 13.3,
      zoom: 7,
      links: [],
      nodes: {}

    }
    this.config = {
    }
  }
  // fetches the Config from public, and sets the values in the config.
  async setConfig () {
    const config = await fetch('config.JSON').then(data => data.json()).catch(err => console.error(err))
    this.config = config
    this.config.updateFrequency = (config.MAPS_UPDATE_FREQUENCY == 0 || config.MAPS_UPDATE_FREQUENCY == undefined) ? config.GLOBAL_UPDATE_FREQUENCY : config.MAPS_UPDATE_FREQUENCY
  }
  // Toggles the live updating either on or off. The updating frequency is set in the config.
  change () {
    let liveUpdater = this.state.liveUpdater
    if (this.state.liveUpdate) {
      liveUpdater = setInterval(() => {
        this.setInitalState()
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
  // Normalize the value to be between tmin and tmax, used to ensure correct colors for the HSL.
  mapValue=(value, vmin, vmax, tmin, tmax) => {
    return vmin === vmax ? tmin : Math.ceil((value - vmin) / (vmax - vmin) * (tmax - tmin) + tmin)
  }

  // fetches the nodegraph and geolocations, and rewrapes it into objects that are easily handled by the rest of the frontend.
  async setInitalState () {
    let url = document.URL.split(':3000')[0]
    let stateToBe = await fetch(`${url}:8090/network`)
      .then(response => response.json())
      .catch(err => console.error(err))
    stateToBe = stateToBe['collection']
    // gives the first network graph in the collection of networkGraphs
    let networkGraph = stateToBe.filter(x => x['collection'][0]['type'] === 'NetworkGraph')[0]['collection'][this.config['MAP_PATH']]
    let geoLocations = stateToBe.filter(x => x['collection'][0]['type'] === 'GeoLocation')[0]['collection']
    let nodes = networkGraph['nodes'].map(node => { return node['id'] })
    let links = networkGraph['links']
    let linkMin = this.config['MIN_THRESHOLD'] || links.reduce((a, b) => a.cost > b.cost ? b : a).cost
    let linkMax = this.config['MAX_THRESHOLD'] || links.reduce((a, b) => a.cost < b.cost ? b : a).cost
    let locs = geoLocations.map(l => {
      let id = l['Originator']
      let date = l['Time']
      let time = `${date['Year4Digit']}-${date['MonthNumeric']}-${date['Day']}T${date['HourTime']}:${date['MinuteTime']}:${date['SecondTime']}`
      let pos = l['Position']
      let lng = pos['Longitude']
      let lat = pos['Latitude']
      return [ [lat, lng], time, id ]
    })
    let latmin = locs.reduce((current, min) => current[0][0] > min[0][0] ? min : current)[0][0]
    let latmax = locs.reduce((current, min) => current[0][0] < min[0][0] ? min : current)[0][0]
    let lngmin = locs.reduce((current, min) => current[0][1] > min[0][1] ? min : current)[0][1]
    let lngmax = locs.reduce((current, min) => current[0][1] < min[0][1] ? min : current)[0][1]
    let bounds = [[latmin, lngmin], [latmax, lngmax]]
    // moves the map above the first node, on the first init of the page.
    if (this.state.adjustView) {
      this.setState({
        lat: locs[0][0][0],
        lng: locs[0][0][1],
        adjustView: false
      })
    }
    let x = {}
    for (let i = 0; i < nodes.length; i++) {
      let id = nodes[i]
      // This makes the assumption that there will only be one node with the location of an originator.
      let matchingLoc = locs.filter(location => location.includes(id))[0]
      let pos = matchingLoc[0]
      let time = matchingLoc[1]
      x[nodes[i]] = { pos: pos, neighbours: new Set([]), time: time }
    }

    this.setState({
      bound: bounds,
      nodes: x,
      links: links.map(link => {
        return {
          cost_text: link['cost_text'],
          cost: link['cost'],
          source: link['source'],
          target: link['target'],
          color: `hsl(${this.mapValue(link.cost, linkMin, linkMax, 120, 0)},100%,66%)`
        }
      })
    })
    this.addNeighbours()
  }
  // Iterates over the links and adds src and trg to the neigbours of each node.
  addNeighbours () {
    let links = this.state.links
    let nodes = this.state.nodes
    links.forEach(link => {
      let src = link['source']
      let trg = link['target']
      nodes[src]['neighbours'].add(trg)
      nodes[trg]['neighbours'].add(src)
    })
    this.setState({ nodes: nodes })
  }
  // Finds the location of a node
  findLatLng (id) {
    if (id in this.state.nodes) {
      return this.state.nodes[id]['pos']
    }
  }
  // Sets the dimentions of the Map.
  updateDimensions () {
    const height = window.innerHeight
    this.setState({ height: height })
  }
  // Sets the config, has to be done before setting the init state.
  componentWillMount () {
    this.setConfig().then(res => {
      this.setInitalState()
    })
    this.updateDimensions()
  }

  componentDidMount () {
    if (!this.state.liveUpdate) {
      this.setInitalState()
    }
  }
  render () {
    // builds nodes with leaflet components
    let nodes = Object.keys(this.state.nodes).map(key => {
      let pos = this.state.nodes[key]['pos']
      let time = this.state.nodes[key]['time']
      let neighbours = [...this.state.nodes[key]['neighbours']].map(node => {
        return (
          <div key={node.toString()} style={{ display: 'flex', flexDirection: 'column' }}>
            {node}
          </div>)
      })
      let posShow = pos.map(p => {
        return (<div key={p.toString()}style={{ display: 'flex', flexDirection: 'column' }}>
          {p}
        </div>)
      })
      return (

        <Marker key={pos} position={pos}>
          <Popup style={{ display: 'flex', flexDirection: 'column' }}>
            <div><b>IP: </b>{key}</div>
            <div><b>Amount of neighbours: </b>{neighbours.length}</div>
            <div><b>Neighbours: </b>{neighbours}</div>
            <div><b>Location: </b>{posShow}</div>
            <div><b>Datetime: </b>{time}</div>
          </Popup>
          <Circle name={key}center={pos} radius={200} />
        </Marker>)
    })
    // builds links with leaflet components
    let links = this.state.links.map(link => {
      let src = link['source']
      let trg = link['target']
      let source = this.findLatLng(src)
      let target = this.findLatLng(trg)
      let cost = link['cost']
      let pos = [source, target]
      return (
        <Polyline key={pos} color={link.color} positions={pos}>
          <Popup>{cost}<br />Source : {src} Target: {trg}</Popup>
        </Polyline>
      )
    })
    // sets the map above Berlin
    const position = [this.state.lat, this.state.lng]
    return (
      <Map key= {this.state.key} zoomControl= {false} bounds= {this.state.bound}center={position} zoom={this.state.zoom} style={{ height: this.state.height }} >

        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <FeatureGroup>
          <EditControl
            position='topright'
            draw={{
              rectangle: true
            }}
          />
          {nodes}
          {links}
          {console.log(links.length)}
          <Control position="topright" >
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

          </Control>

          <Control position="topright" >
            <Button
              content={'Force Rerender'}
              onClick={() => {
                this.setState(prevState => ({
                  key: prevState.key + 1
                }))
              }
              }
            />
          </Control>
        </FeatureGroup>
      </Map>
    )
  }
}
