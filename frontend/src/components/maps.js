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
        links:[{
            cost:123,
            target:"123.123.123.11",
            source:"123.123.123.12"
        }],
        nodes:
          [{"123.123.123.11": {
          pos: [52.3,13.5]}},
          {"123.123.123.12": {
            pos:[52.2,13.4]}}
          ]
    }}

    async setInitalState () {
        let stateToBe= await fetch("http://localhost:3001/mapnod").then(response => {
          return response.json()
        }).catch(err => console.error(err))
        let nodes = stateToBe["nodes"]
        let links = stateToBe["links"]
        let keys = nodes.map(node => {return node["id"]})
        this.setState({
            ["nodes"]:nodes.map(node =>{
                return {[node["id"]] :{
                  pos:[node["Location"]["Position"]["Latitude"],node["Location"]["Position"]["Longitude"]],
                  neighbours:0,
                  time: node["Location"]["Time"]
                }}

            })
        
        })
        
       this.setState({
            links:links.map(link =>{
                return{
                cost:link["cost"],
                source:link["source"],
                target:link["target"]
                }


            })
        })
      }

      addNeighbour(id){}


      findLatLng(id){
        let nodes = this.state.nodes
        let pos = nodes.map(node => {
            let key = Object.keys(node)[0]
            if (id == key){
                 return node[key]["pos"] 
            } 
        });
        return pos
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
          let pos = node["pos"]
          return (

            <Marker position={pos}>
                <Popup>{key}<br />Easily customizable.</Popup>
                <Circle name={key}center={pos} radius={200} />
            </Marker>)
        })

        let links = this.state.links.map(link => {
            let source = this.findLatLng(link["source"])
            let target = this.findLatLng(link["target"])
            let cost = link["cost"]
            let colors = ["green","lime","GreenYellow ","yellow","orange","OrangeRed ","red","Crimson","DarkRed ","black"]
            let targeter = Math.round(cost/1000000)
            //console.table([this.findLatLng(source),this.findLatLng(target)])
            //Only works for basecase (aka no fetch from mocker 
            //let pos = [this.findLatLng(source)[1],this.findLatLng(target)[0]]
            let cleanedSource = source.filter((y) => { if (y != undefined) {return y}})
            let cleanedTarget = target.filter((y) => { if (y != undefined) {return y}})
            let pos = [cleanedSource,cleanedTarget]
            console.log(pos)
            return (
                <Polyline color={colors[targeter]} positions={pos} />
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
    {links}
  </FeatureGroup>
            </Map>
        )
        }
    }