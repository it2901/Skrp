const express = require('express');
const jsf =  require('json-schema-faker');
require('dotenv').config()
const app = express()
const port = process.env.PORT;
const cwd = `${__dirname}/Schemes`;


//Fetch API endpoints
let mapnodesEnd = process.env.MAP_AND_NODES_END_POINT
let networkroutesEnd = process.env.NETWORK_ROUTES_END_POINT
let geolocationsEnd = process.env.GEOGRAPHIC_LOCATION_END_POINT
let networkdomainEnd = process.env.NETWORK_DOMAIN_END_POINT
let networkgraphEnd = process.env.NETWORK_GRAPH_END_POINT

//fetch update frequencies
let gfrq = process.env.REACT_APP_GLOBAL_UPDATE_FREQUENCY
let mfrq = process.env.MAP_AND_NODES_UPDATE_FREQUENCY
let glfrq = process.env.GEOGRAPHIC_LOCATION_UPDATE_FREQUENCY
let ndfrq = process.env.NETWORK_DOMAIN_UPDATE_FREQUENCY
let ngfrq = process.env.NETWORK_GRAPH_UPDATE_FREQUENCY
let nrfrq = process.env.NETWORK_ROUTES_UPDATE_FREQUENCY

let mupdateFrequency = (mfrq == 0 || mfrq == undefined) ? gfrq : mfrq
let glupdateFrequency = (glfrq == 0 || glfrq == undefined) ? gfrq : glfrq
let ndupdateFrequency = (ndfrq == 0 || ndfrq == undefined) ? gfrq : ndfrq
let ngupdateFrequency = (ngfrq == 0 || ngfrq == undefined) ? gfrq : ngfrq
let nrupdateFrequency = (nrfrq == 0 || nrfrq == undefined) ? gfrq : nrfrq

/*
console.table([
     ["Map",mfrq,mapnodesEnd],
     ["Geo",glfrq,geolocationsEnd],
     ["NetD",ndfrq,networkdomainEnd],
     ["NetG",ngfrq,networkgraphEnd],
     ["NetR",nrfrq,networkroutesEnd],])
*/

//Map Nodes
setInterval(() => {
     mapnodes = require('./Schemes/mapnodes.json')  
     mapnodesData = jsf.generate(mapnodes).collection[0];
}, mupdateFrequency);
//GeoLocation
setInterval(() => {
     geolocations = require('./Schemes/geolocations.json')
     geolocationsData = jsf.generate(geolocations).collection[0];
}, glupdateFrequency);
//Network Domain
setInterval(() => {
     networkdomain = require('./Schemes/networkdomain.json')
     networkdomainData = jsf.generate(networkdomain).collection[0];
}, ndupdateFrequency);
//Network Graph
setInterval(() => {
     networkgraph = require('./Schemes/networkgraph.json') 
     networkgraphData = jsf.generate(networkgraph,cwd).collection[0];
}, ngupdateFrequency);
//Network Routes
setInterval(() => {
     networkroutes = require('./Schemes/networkroutes.json')
     networkroutesData = jsf.generate(networkroutes).collection[0];   
}, nrupdateFrequency);


app.get(mapnodesEnd ,(req,res) => res.send(mapnodesData))
app.get(networkroutesEnd,(req,res) => res.send(networkroutesData))
app.get(geolocationsEnd,(req,res) => res.send(geolocationsData))
app.get(networkdomainEnd,(req,res) => res.send(networkdomainData))
app.get(networkgraphEnd,(req,res) => res.send(networkgraphData))
app.listen(port, () => console.log(`Server running @${port}`))




