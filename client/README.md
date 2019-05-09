# Connecting to OKSE

Start okse with `java -jar -Xms256m -Xmx512m okse.jar`. This is currently run
on the VM as `okse.service`. In other words, if you are using the VM, you will
not need to run okse manually.

Log in to OKSE with user, pass = admin, password.

Possible adaptations: (see gateway.properties)
- keepAlivePeriod = n seconds
- forwarederTimeout = n seconds
 (...)

# How adaptions are currently performed
A script requests the current configuration from the Skrp-API. The script then
proceeds to rewrite properties that differ in okse.properties and requested
properties. Once properties are updates, OKSE is restarted.

The client runs on the VM as `skrp-adaption-client.service`. The client will listen
for changes from the backend, as well as the network graph. If relevant updates
occur in either datasource, the client will update the config of the broker and
restart it.

# Setting up the client for development
The client is developed in python 3.5.3. Refer to requirement.txt for dependencies.
The easiest way to set up dependencies is with pip and a virtual environment.

`python3 -m venv venv`
`source venv/bin/activate`
`pip install -r requirements.txt`

To start the client during development you should have the backend, and mocker
running. In order for the client to pull data from the backend, you will need
to provide the `BACKEND_HOST` environment variable. An optional
enviromnent variable `INTERVAL` can also be set. Interval is given in seconds, and
defines how often the client will poll the data sources.

For instance, you can run the client with:

`BACKEND_HOST=localhost/api INTERVAL=30.0 python client.py`
