# Backend documentation

This is the documentation for all the rest api endpoints.
Here we explain what all the different endpoints do and all their supported operations.

## Format
The documentation format for the accepted HTTP requst is as follows.

| HTTP Method | Parameters | Body | Content-Type  |
| ----------- |----------- |------| ------------- |

## Endpoints

List of all the different endpoints and an explanation of their purpose.

### /lognetwork


| POST | None | JSON | application/json |
|------|------|------|------------------|

This endpoint is responsible for logging network information which is sent as a
NetJSON NetworkCollection object and then responding with a JSON object describing
the command to be executed.

The JSON body request has the following structure:

- device-id (Integer)
- netcoll (NetworkCollection)

The JSON response has the following scructure:

- name (String)
- type (String)
- options (Map)
  - protocol (String)
  - keep-alive-period (Integer)
  - max-retries (Integer)
  - waiting-time (Integer)

### /configure

| GET | None | None | None |
|-----|------|------|------|

Endpoint for retrieving the latest configuration row in the config table. Config table
contains configuration parameters for the OKSE message broker.

| POST | None | JSON | application/json |
|------|------|------|------------------|

Endpoint for inserting an OKSE congifuration in the database. This endpoint accepts
a JSON body which can contain any number of OKSE parameters, the only required paramater
is a `device_id`. When the row as been inserted the endpoint will return the entire row
in response as a JSON object.

### /serverconfig

| GET | None | None | None |
|-----|------|------|------|

Endpoint for retrieving the servers configuration file. Amongst other things this file
contains information about what the set data source is.

### /filtersyslog

| GET | device_id, adaption_type, description, data, date_from, date_to | None | None |
|-----|-----------------------------------------------------------------|------|------|

Endpoint for filtering the system logging database table.
This endpoint accepts any combination of the parameters, excluding combinations where
only _either_ `date_from` or `date_to` is present, as they are reliant on each other. 
Returns a JSON array which is a subset of the systemlog (log of adaptions), i.e. the 
log filtered by sent parameters. If the request does not contain any parameters, the 
whole log is retrieved. `Date`, `date_from` and `date_to` have to be ISO-formatted 
(yyyy-mm-dd).

Each JSON element in the response-array has the following structure:

- system_log_id Integer
- device_id     Integer
- adaption_id   Integer
- description   String
- created       String
- adaption_type String
- adaption_id_2 Integer

### /logadaption

| POST| adaption_type, device_id, description | None | None |
|-----|---------------------------------------|------|------|

Endpoint for logging an adaption that has been made to the database.
All parameters are required, if the `device_id` is not registered in the database 
the endpoint handler will automatically register it.
Returns a JSON object with the database row entry, where `adaption_id` 
corresponds to the sent `adaption_type`.

The JSON response has the following structure:
- system_log_id Integer
- device_id     Integer
- adaption_id   Integer
- description   String
- created       String

### /network

| GET | None | None | None |
|-----|------|------|------|

Endpoint for retireving the NetJSON NetworkCollection which contains all information over
the network at any given time. This endpoint will retrieve the latest table entry and
then clean NetworkGraph objects for Nodes which don't have a corresponding GeoLocation
and then remove all links which contain nodes that aren't defined in the Nodes array of
the NetworkGraph objects.

### /rawnetwork

| GET | None | None | None |
|-----|------|------|------|

Endpoint for retrieving the NetJSON NetworkCollection which contains all information over
the netwrok at any given time. This endpoint will retrieve the latest table entry
uncleaned, so the data have errors.


### /syslog

| GET |       None      | None | None |
|-----|-----------------|------|------|

| GET |       date      | None | None |
|-----|-----------------|------|------|

| GET | datefrom dateto | None | None |
|-----|-----------------|------|------|

Endpoint for retrieving entire row from the system log. If no parameters are passed it
will retieve the entire table, if a date is passed it will retrieve all systemlog rows
from the given date, lastly if give datefrom and dateto it will retireve all systemlog
rows in that date range.
