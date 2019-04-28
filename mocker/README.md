## Usage

This is a mocker that exposes fake NETJSON-data. 

The API-ends are exposed at the following addresses by default

- Geolocations: `http://localhost:3001/geoloc`
- NetworkDomain: `http://localhost:3001/netdom`
- NetworkGraph: `http://localhost:3001/netgph`
- NetworkRoutes: `http://localhost:3001/netrou`

Firstly, if you don´t have node, get it with the command `sudo apt install nodejs npm`


To use this you need to go to the mocker folder and type `npm install` in the terminal.
When the installation is done type `nodemon mocker.js`
At this point your server is running and the API-ends are up.


## How i made it

The mocker is a generic Node and Express server, IT serves mocked NETJSON using json-schema-faker. I have taken the schemas given to us by FFI and made it so lots of the fields are required, so that the mocker always gives us that data. I have omitted adding some of the data that i thought unnecessary.



## Configuration 
The default for this mocker is
```
GLOBAL_UPDATE_FREQUENCY = 4500
MAP_AND_NODES_UPDATE_FREQUENCY = 1000
GEOGRAPHIC_LOCATION_UPDATE_FREQUENCY = 1000
NETWORK_DOMAIN_UPDATE_FREQUENCY = 1000
NETWORK_GRAPH_UPDATE_FREQUENCY = 1000
NETWORK_ROUTES_UPDATE_FREQUENCY = 1000


PORT = 3001
MAP_AND_NODES_END_POINT = '/mapnod'
GEOGRAPHIC_LOCATION_END_POINT = '/geoloc'
NETWORK_DOMAIN_END_POINT = '/netdom'
NETWORK_GRAPH_END_POINT = '/netgph'
NETWORK_ROUTES_END_POINT = '/netrou'
```

The `GLOBAL_UPDATE_FREQUENCY` is used for the API endpoints that have undefined or 0 as their value. 

You can change the API endpoints by chaning the PORT that the API is exposed on, and the paths which provide the different JSON objects. 
