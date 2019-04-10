const express = require('express');
const jsf =  require('json-schema-faker');
const app = express()
const port = 3001;

let x = 1;
app.get('/',(req,res) => res.send('Hello world'))
let geolocations = require('./Schemes/geolocations.json')  
const geolocationsEnd = JSON.stringify(jsf.generate(geolocations).collection[0]);
let networkdomain = require('./Schemes/networkdomain.json')  
const networkdomainEnd = JSON.stringify(jsf.generate(networkdomain).collection[0]);
let networkgraph = require('./Schemes/networkgraph.json')  
const networkgraphEnd = JSON.stringify(jsf.generate(networkgraph).collection[0]);
let networkroutes = require('./Schemes/networkroutes.json')
const networkroutesEnd = JSON.stringify(jsf.generate(networkroutes).collection[0]);

app.get('/netrou',(req,res) => res.send(networkroutesEnd))
app.get('/geoloc',(req,res) => res.send(geolocationsEnd))
app.get('/netdom',(req,res) => res.send(networkdomainEnd))
app.get('/netgph',(req,res) => res.send(networkgraphEnd))
app.listen(port, () => console.log(`Server running @${port}`))




