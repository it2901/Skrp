#Usage

This is a mocker that exposes fake NETJSON-data. 

The API-ends are exposed at the following addresses

- Geolocations: `http://localhost:3001/geoloc`
- NetworkDomain: `http://localhost:3001/netdom`
- NetworkGraph: `http://localhost:3001/netgph`
- NetworkRoutes: `http://localhost:3001/netrou`

To use this you need to go to the mocker folder and type `npm install` in the terminal.
When the installation is done type `node mocker.js`
At this point your server is running and the API-ends are up.


#How i made it

The mocker is a generic Node and Express server, IT serves mocked NETJSON using json-schema-faker. I have taken the schemas given to us by FFI and made it so lots of the fields are required, so that the mocker always gives us that data. I have omitted adding some of the data that i thought unnecessary.


