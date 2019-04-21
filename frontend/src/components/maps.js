import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup,  FeatureGroup, Circle, Polyline  } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import Control from 'react-leaflet-control';

  
export default class Maps extends Component {
    constructor() {
        super()
        this.state = {
          updaters: [],
          liveUpdate: true,
          liveUpdater: 0,
            heigth: "1080px",
        lat: 52.5,
        lng: 13.3,
        zoom: 12,
        links:[{
            cost:123,
            target:"123.123.123.11",
            source:"123.123.123.12"
        }],
        nodes:{
          "123.123.123.11" : {pos:[52.3,13.5], neighbours:[]},
          "123.123.123.12" : {pos:[52.2,13.4], neighbours:[]}
        }
    }}

    change () {
      let liveUpdater = this.state.liveUpdater
        if (this.state.liveUpdate){
            liveUpdater = setInterval(() => {
            this.setInitalState()
          }, 5000);
         this.setState({
           liveUpdater:liveUpdater
         })
        }
        else{
          clearInterval(this.state.liveUpdater)
          this.setState({
            liveUpdater:0
          })
        }
    }

    async setInitalState () {
        let stateToBe= await fetch("http://localhost:3001/mapnod").then(response => {
          return response.json()
        }).catch(err => console.error(err))
        let nodes = stateToBe["nodes"].map(node => {return node["id"]})
        let links = stateToBe["links"]
        let locs = stateToBe["Locations"].map(l => {
          let pos = l["Location"]["Position"]
          let lng = pos["Longitude"] 
          let lat = pos["Latitude"]
          return [lat,lng]
        })
        let x = {}
        for (let i = 0; i < 51; i++) {
          x[nodes[i]] = {pos:locs[i],neighbours:[]}
        }
        this.setState({
            nodes:x
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
        this.addNeighbours()
      }

      addNeighbours(){
        const newState = this.state
        let links = this.state.links
        let nodes = this.state.nodes
        links.forEach(link => {
          let src = link["source"]
          let trg = link["target"]
          nodes[src]["neighbours"].push(trg)
          nodes[trg]["neighbours"].push(src)
        })
        newState.nodes = nodes
        this.setState(newState)
        

      }

      findLatLng(id){
        if (id in this.state.nodes){
          return this.state.nodes[id]["pos"]
        }
      }

    updateDimensions() {
        const height = window.innerWidth >= 992 ? window.innerHeight : 400
        this.setState({ height: height })
      }

      componentDidMount(){
        if (!this.state.liveUpdate){
        this.setInitalState()
    }
  } 
    
      componentWillMount() {
        this.updateDimensions()
        
      }


      

    render() {
      let nodes = Object.keys(this.state.nodes).map(key => {
        let pos = this.state.nodes[key]["pos"]
        let neighbours = this.state.nodes[key]["neighbours"]
        return (

          <Marker key={pos} position={pos}>
                <Popup>Name: {key}<br />Neighbours: {neighbours}<br /> Amount of neighbours: {neighbours.length}.</Popup>
                <Circle name={key}center={pos} radius={200} />
            </Marker>)

      })

        let links = this.state.links.map(link => {
            let src = link["source"]
            let trg = link["target"]
            let source = this.findLatLng(src)
            let target = this.findLatLng(trg)
            let cost = link["cost"]
            let colors = ["green","lime","GreenYellow ","yellow","orange","OrangeRed ","red","Crimson","DarkRed ","black"]
            let targeter = Math.round(cost/1000000)
            let pos = [source,target]
            return (
                <Polyline key={cost}color={colors[targeter]} positions={pos}>
                <Popup>{cost}<br />Source : {src} Target: {trg}</Popup>
                </Polyline>
            )
        })
        const position = [this.state.lat, this.state.lng]
        return (
            <Map center={position} zoom={this.state.zoom} style={{ height: this.state.height }} >
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
    <Control position="topleft" >
        <button 
          onClick={ () => 
            {
              this.setState(prevState => ({
            liveUpdate: !prevState.liveUpdate,
          }))
          this.change()
        }
        
        }
        >
          Toogle Live Update
        </button>
      </Control>
  </FeatureGroup>
            </Map>
        )
        }
    }