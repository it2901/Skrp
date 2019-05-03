const express = require('express');
const jsf =  require('json-schema-faker');
const fetch = require('node-fetch')
const app = express()
const fs = require('fs')
const cwd = `${__dirname}/Schemes`;

const  config = JSON.parse(fs.readFileSync('./config.JSON'))


const port =  config.PORT
let mapnodesEnd =  config.MAP_AND_NODES_END_POINT
let networkroutesEnd =  config.NETWORK_ROUTES_END_POINT
let geolocationsEnd = config.GEOGRAPHIC_LOCATION_END_POINT
let networkdomainEnd = config.NETWORK_DOMAIN_END_POINT
let networkgraphEnd = config.NETWORK_GRAPH_END_POINT
let deviceconfigurationEnd =  config.DEVICE_CONFIGURATION_END_POINT
let devicemonitoringEnd = config.DEVICE_MONITORING_END_POINT

//fetch update frequencies


let gfrq =  config.GLOBAL_UPDATE_FREQUENCY
let mfrq =  config.MAP_AND_NODES_UPDATE_FREQUENCY
let glfrq =  config.GEOGRAPHIC_LOCATION_UPDATE_FREQUENCY
let ndfrq =  config.NETWORK_DOMAIN_UPDATE_FREQUENCY
let ngfrq =  config.NETWORK_GRAPH_UPDATE_FREQUENCY
let nrfrq =  config.NETWORK_ROUTES_UPDATE_FREQUENCY
let dcfrq =  config.DEVICE_CONFIGURATION_UPDATE_FREQUENCY
let dmfrq =  config.DEVICE_MONITORING_UPDATE_FREQUENCY


let mupdateFrequency = (mfrq == 0 || mfrq == undefined) ? gfrq : mfrq
let glupdateFrequency = (glfrq == 0 || glfrq == undefined) ? gfrq : glfrq
let ndupdateFrequency = (ndfrq == 0 || ndfrq == undefined) ? gfrq : ndfrq
let ngupdateFrequency = (ngfrq == 0 || ngfrq == undefined) ? gfrq : ngfrq
let nrupdateFrequency = (nrfrq == 0 || nrfrq == undefined) ? gfrq : nrfrq
let dcupdateFrequency = (dcfrq == 0 || dcfrq == undefined) ? gfrq : dcfrq
let dmupdateFrequency = (dmfrq == 0 || dmfrq == undefined) ? gfrq : dmfrq




/*
console.table([
     ["Map",mfrq,mapnodesEnd],
     ["Geo",glfrq,geolocationsEnd],
     ["NetD",ndfrq,networkdomainEnd],
     ["NetG",ngfrq,networkgraphEnd],
     ["NetR",nrfrq,networkroutesEnd],])
*/
/*
//Device Config
setInterval(() => {
     devconf = require('./Schemes/deviceconfiguration.json')
     devConData = jsf.generate(devconf);
}, dcupdateFrequency);
//device monitoring
setInterval(() => {
     devmon = require('./Schemes/deviceconfiguration.json')
     devMonData = jsf.generate(devmon); 
}, dmupdateFrequency);
*/
//Map Nodes
setInterval(() => {
     mapnodes = require('./Schemes/mapnodes.json')  
     mapnodesData = jsf.generate(mapnodes);
}, mupdateFrequency);
//GeoLocation
setInterval(() => {
     geolocations = require('./Schemes/geolocations.json')
     geolocationsData = jsf.generate(geolocations);
}, glupdateFrequency);
//Network Domain
setInterval(() => {
     networkdomain = require('./Schemes/networkdomain.json')
     networkdomainData = jsf.generate(networkdomain);
}, ndupdateFrequency);
//Network Graph
setInterval(() => {
     networkgraph = require('./Schemes/networkgraph.json') 
     networkgraphData = jsf.generate(networkgraph,cwd);
     main = [networkgraphData,geolocationsData]
}, ngupdateFrequency);
//Network Routes
setInterval(() => {
     networkroutes = require('./Schemes/networkroutes.json')
     networkroutesData = jsf.generate(networkroutes);   
}, nrupdateFrequency);

/*
app.get(deviceconfigurationEnd ,(req,res) => res.send(devConData))
app.get(devicemonitoringEnd ,(req,res) => res.send(devMonData))
*/
app.get(mapnodesEnd ,(req,res) => res.send(mapnodesData))
app.get(networkroutesEnd,(req,res) => res.send(networkroutesData))
app.get(geolocationsEnd,(req,res) => res.send(geolocationsData))
app.get(networkdomainEnd,(req,res) => res.send(networkdomainData))
app.get(networkgraphEnd,(req,res) => res.send(networkgraphData))
app.get("/main",(req,res) => res.send(main))
app.listen(port, () => console.log(`Server running @${port}`))



