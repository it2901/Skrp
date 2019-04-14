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
        nodes:
          [{"123.123.123.11": {
          lat: 52.3,
          lng: 13.5}},
          {"123.123.123.12": {
            lat: 52.2,
            lng: 13.4}}
          ]
    }}

    async setInitalState () {
        let stateToBe= await fetch("http://localhost:3001/mapnod").then(response => {
          return response.json()
        }).catch(err => console.error(err))
        let nodes = stateToBe["nodes"]
        let links = stateToBe["links"]
        let keys = nodes.map(node => {return node["id"]})
        let x = 0
        this.setState({
            nodes:nodes.map(node =>{
                return {[node["id"]] :{
                  lat:node["Location"]["Position"]["Latitude"],
                  lng:node["Location"]["Position"]["Longitude"],
                  neighbours:0,
                  time: node["Location"]["Time"]
                }}

            })
        })
        console.log(this.state)
          
      }

    updateDimensions() {
        const height = window.innerWidth >= 992 ? window.innerHeight : 400
        this.setState({ height: height })
      }
    
      componentWillMount() {
        this.updateDimensions()
        this.setInitalState()
      }

    render() {
        const latlngs = [
            [52.3, 13.5],
            [52.3, 13.4],
            [52.2, 13.3]
        ];
       
        let nodes = this.state.nodes.map(obj => {
            let key = Object.keys(obj)
          let node = obj[key]
          let x = node["lng"]
          let y = node["lat"]
          return (

            <Marker position={[y,x]}>
                <Popup>{key}<br />Easily customizable.</Popup>
                <Circle name={key}center={[y,x]} radius={200} />
            </Marker>)
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