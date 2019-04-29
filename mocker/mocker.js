const express = require('express');
const jsf =  require('json-schema-faker');
const app = express()
const port = 3001;
const cwd = `${__dirname}/Schemes`;




setInterval(() => {
     devmon = require('./Schemes/deviceconfiguration.json')
     netcoll = require('./Schemes/networkcollection.json')  
     devconf = require('./Schemes/deviceconfiguration.json')
     mapnodes = require('./Schemes/mapnodes.json')  
     geolocations = require('./Schemes/geolocations.json')  
     networkdomain = require('./Schemes/networkdomain.json')  
     networkgraph = require('./Schemes/networkgraph.json')  
     networkroutes = require('./Schemes/networkroutes.json')
     devmonEnd = jsf.generate(devmon)
     devconfEnd = jsf.generate(devconf)
     netcollEnd = jsf.generate(netcoll).collection[0];
     mapnodesEnd = jsf.generate(mapnodes).collection[0];
     geolocationsEnd = jsf.generate(geolocations).collection[0];
     networkdomainEnd = jsf.generate(networkdomain).collection[0];
     networkgraphEnd = jsf.generate(networkgraph,cwd).collection[0];
     networkroutesEnd = jsf.generate(networkroutes).collection[0];
}, 5000);

app.get('/devmon',(req,res) => res.send(devmonEnd))
app.get('/devcon',(req,res) => res.send(devconfEnd))
app.get('/netcol',(req,res) => res.send(netcollEnd))
app.get('/mapnod',(req,res) => res.send(mapnodesEnd))
app.get('/netrou',(req,res) => res.send(networkroutesEnd))
app.get('/geoloc',(req,res) => res.send(geolocationsEnd))
app.get('/netdom',(req,res) => res.send(networkdomainEnd))
app.get('/netgph',(req,res) => res.send(networkgraphEnd))
app.listen(port, () => console.log(`Server running @${port}`))




