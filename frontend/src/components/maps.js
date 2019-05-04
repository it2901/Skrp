import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, FeatureGroup, Circle, Polyline } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import Control from 'react-leaflet-control'
import { Button } from 'semantic-ui-react'

export default class Maps extends Component {
  constructor () {
    super()
    this.state = {
      updaters: [],
      liveUpdate: true,
      liveUpdater: 0,
      heigth: '1080px',
      lat: 52.5,
      lng: 13.3,
      zoom: 12,
      links: [{
        cost: 123,
        target: '123.123.123.11',
        source: '123.123.123.12'
      }],
      nodes: {
        '123.123.123.11': { pos: [52.3, 13.5], neighbours: [] },
        '123.123.123.12': { pos: [52.2, 13.4], neighbours: [] }
      }

    }
    this.config = {
    }
  }

  async setConfig () {
    const config = await fetch('config.JSON').then(data => data.json()).catch(err => console.error(err))
    this.config = config
    this.config.updateFrequency = (config.MAPS_UPDATE_FREQUENCY == 0 || config.MAPS_UPDATE_FREQUENCY == undefined) ? config.GLOBAL_UPDATE_FREQUENCY : config.MAPS_UPDATE_FREQUENCY
  }

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

  async setInitalState () {
    let stateToBe = await fetch(this.config.MAP_AND_NODES)
      .then(response => response.json())
      .then(data => data.collection[this.config.MAP_PATH].collection[0])
      .catch(err => console.error(err))
    let nodes = stateToBe['nodes'].map(node => { return node['id'] })
    let links = stateToBe['links']
    let locs = stateToBe['Locations'].map(l => {
      let date = l['Location']['Time']
      let time = `${date['Year4Digit']}-${date['MonthNumeric']}-${date['Day']}T${date['HourTime']}:${date['MinuteTime']}:${date['SecondTime']}`
      let pos = l['Location']['Position']
      let lng = pos['Longitude']
      let lat = pos['Latitude']
      return [[lat, lng], time]
    })
    let x = {}
    for (let i = 0; i < 51; i++) {
      x[nodes[i]] = { pos: locs[i][0], neighbours: [], time: locs[i][1] }
    }
    this.setState({
      nodes: x
    })
    this.setState({
      links: links.map(link => {
        return {
          cost: link['cost'],
          source: link['source'],
          target: link['target']
        }
      })
    })
    this.addNeighbours()
  }

  addNeighbours () {
    const newState = this.state
    let links = this.state.links
    let nodes = this.state.nodes
    links.forEach(link => {
      let src = link['source']
      let trg = link['target']
      nodes[src]['neighbours'].push(trg)
      nodes[trg]['neighbours'].push(src)
    })
    newState.nodes = nodes
    this.setState(newState)
  }

  findLatLng (id) {
    if (id in this.state.nodes) {
      return this.state.nodes[id]['pos']
    }
  }

  updateDimensions () {
    const height = window.innerHeight
    this.setState({ height: height })
  }

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
    let nodes = Object.keys(this.state.nodes).map(key => {
      let pos = this.state.nodes[key]['pos']
      let time = this.state.nodes[key]['time']
      let neighbours = this.state.nodes[key]['neighbours'].map(node => {
        return (
          <div>
            <br/>{node}
          </div>)
      })

      return (

        <Marker key={pos} position={pos}>
          <Popup>Name: <b>{key}</b>
            <br/>
            <br />Neighbours: {neighbours}
            <br /> Amount of neighbours: {neighbours.length}
            <br/>
            <br/> Time: {time}
                .</Popup>
          <Circle name={key}center={pos} radius={200} />
        </Marker>)
    })

    let links = this.state.links.map(link => {
      let src = link['source']
      let trg = link['target']
      let source = this.findLatLng(src)
      let target = this.findLatLng(trg)
      let cost = link['cost']
      const mapValue = (v, s1, e1, s2, e2) => (v - s1) / (e1 - s1) * (e2 - s2) + s2
      let linkMin = this.config['MIN_THERSHOLD']
      let linkMax = this.config['MAX_THERSHOLD']
      let color = `hsl(${mapValue(cost, linkMin, linkMax, 120, 0)},100%,66%)`
      let targeter = Math.round(cost * 6 / this.config.MAX_THERSHOLD)
      console.log(targeter)
      let pos = [source, target]
      return (
        <Polyline key={cost}color={color} positions={pos}>
          <Popup>{cost}<br />Source : {src} Target: {trg}</Popup>
        </Polyline>
      )
    })
    const position = [this.state.lat, this.state.lng]
    return (
      <Map zoomControl= {false} center={position} zoom={this.state.zoom} style={{ height: this.state.height }} >
        <div>{this.state.liveUpdate} </div>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
        </FeatureGroup>
      </Map>
    )
  }
}
