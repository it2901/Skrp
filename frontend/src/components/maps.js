import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
const height= {height:"3840px"}
  
export default class Maps extends React.Component {
    constructor() {
        super()
        this.state = {
        lat: 50,
        lng: 20,
        zoom: 13
        }
    }
    render() {
        const position = [this.state.lat, this.state.lng]
        return (
            <Map center={position} zoom={this.state.zoom} style={height} >
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            </Map>
        )
        }
    }
        