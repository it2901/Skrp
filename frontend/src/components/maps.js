import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup,  FeatureGroup, Circle  } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
  
export default class Maps extends React.Component {
    constructor() {
        super()
        this.state = {
            heigth: "1080px",
        lat: 52.3,
        lng: 13.5,
        zoom: 18
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
    <Circle center={[52.3, 13.5]} radius={200} />
  </FeatureGroup>
            </Map>
        )
        }
    }
        