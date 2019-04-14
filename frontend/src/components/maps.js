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
        nodes:{
          "123.123.123.15":{
            lat: [52.81956400463932],
            lng: [13.5],
            neighbours: 0},
          "123.123.123.14":{
            lat: [52.9],
            lng: [13.47],
            neighbours: 0}
        }
    }
  }
    async setInitalState () {
      let stateToBe= await fetch("http://localhost:3001/mapnod").then(response => {
        return response.json()
      }).catch(err => console.error(err))
  
      let nodes = stateToBe["nodes"]
      let links = stateToBe["links"]
      nodes.map(node =>{
        console.table(node["id"],node["Location"]["Position"]["Latitude"],node["Location"]["Position"]["Longitude"])
        this.setState(
          {
            nodes:{
            [node["id"]]:
            {
            lat:[node["Location"]["Position"]["Latitude"]],
            lng:[node["Location"]["Position"]["Longitude"]],
            neighbours:0,
            time: [node["Location"]["Time"]],
          }}
        })
      })
      
       links.map(link => {
         let x = link["source"]
         console.log(x)

         if (link["source"] in this.state){
           //this.state["nodes"][link["source"]]["neighbours"] += 1
         }
       })


    }
   

    updateDimensions() {
        const height = window.innerWidth >= 992 ? window.innerHeight : 400
        this.setState({ height: height })
      }
    
      componentWillMount() {
        this.updateDimensions()
        //this.setInitalState()
      }

    render() {
        const latlngs = [
            [52.3, 13.5],
            [52.3, 13.4],
            [52.2, 13.3]
        ];
        let nodes = Object.keys(this.state.nodes).map(key =>{
          let node = this.state.nodes[key]
          let x = node["lng"]
          let y = node["lat"]

          console.table([node["lat"],node["lng"],key,node["neighbours"]])
          return (
            <Marker position={[y,x]}>
                <Popup>{key}<b> lok </b></Popup>
                <Circle name={key} center={[y,x]} radius={20} />
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
        