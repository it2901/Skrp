# Usage
You only need `npm` to run the frontend. Refer to [NPM's setup guide](www.npmjs.com) for installation of the package manager.

# Setup
When you have `npm` installed, run `npm install` to install the library dependecies.
To run the frontend simply `npm start`.

# Testing
To run the tests, simply `npm test`.

#Configuring

You can configure the frontend by supplying the .env with different parameters. 
The following variables are available.

```
REACT_APP_GLOBAL_UPDATE_FREQUENCY = x
REACT_APP_MAPS_UPDATE_FREQUENCY = x
REACT_APP_NODE_GRAPH_UPDATE_FREQUENCY = x
REACT_APP_LOG_UPDATE_FREQUENCY = x
DATA_SOURCE = 'http://localhost:3001'
REACT_APP_NETWORK_GRAPH = "$DATA_SOURCE/netgph"
REACT_APP_MAP_AND_NODES = "$DATA_SOURCE/mapnod"
``` 

The `GLOBAL_UPDATE_FREQUENCY` is used as a default for any page that updates, if noe more specific variable is declared (value = 0 or undefined), it will be used instead. 

The `DATA_SOURCE` is the name of the service that you want to fetch data from, for example, the API end of a tactical router, or our mocker. 

The `REACT_APP_X` with the $DATA_SOURCE only specify which end the different pages should use from a given API/mocker. 


