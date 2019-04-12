const express = require('express');
const jsf =  require('json-schema-faker');
const app = express()
const port = 3001;


setInterval(() => {
     geolocations = require('./Schemes/geolocations.json')  
     networkdomain = require('./Schemes/networkdomain.json')  
     networkgraph = require('./Schemes/networkgraph.json')  
     networkroutes = require('./Schemes/networkroutes.json')
     geolocationsEnd = jsf.generate(geolocations).collection[0];
     networkdomainEnd = jsf.generate(networkdomain).collection[0];
     networkgraphEnd = jsf.generate(networkgraph).collection[0];
     networkroutesEnd = jsf.generate(networkroutes).collection[0];
}, 5000);

app.get('/',(req,res) => res.send('Hello world'))
app.get('/netrou',(req,res) => res.send(networkroutesEnd))
app.get('/geoloc',(req,res) => res.send(geolocationsEnd))
app.get('/netdom',(req,res) => res.send(networkdomainEnd))
app.get('/netgph',(req,res) => res.send(networkgraphEnd))
app.listen(port, () => console.log(`Server running @${port}`))




