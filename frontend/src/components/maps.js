import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup,  FeatureGroup, Circle, Polyline  } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
  
export default class Maps extends React.Component {
    constructor() {
        super()
        this.state = {
            heigth: "1080px",
        lat: 52.3,
        lng: 13.5,
        zoom: 18,
        nodes:[["123.123.123.11",[52.3,13.5]],["123.123.123.12",[52.3, 13.4]]]
        }
    }

    updateDimensions() {
        const height = window.innerWidth >= 992 ? window.innerHeight : 400
        this.setState({ height: height })
      }
    
      componentWillMount() {
        this.updateDimensions()
      }

    render() {
        const latlngs = [
            [52.3, 13.5],
            [52.3, 13.4],
            [52.2, 13.3]
        ];
        let nodes = this.state.nodes.map(node =>{
            return (

            <Marker position={[node[1][0],node[1][1]]}>
                <Popup>{node[0]}<br />Easily customizable.</Popup>
                <Circle name={node[0]}center={[node[1][0],node[1][1]]} radius={20} />
            </Marker>
            )
        })
        const position = [this.state.lat, this.state.lng]
        return (
            <Map center={position} zoom={this.state.zoom} style={{ height: this.state.height }} >
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
    <Polyline color="lime" positions={latlngs}/>
  </FeatureGroup>
            </Map>
        )
        }
    }
        