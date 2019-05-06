import requests
import os
import sys
import logging
from subprocess import call
from jproperties import Properties
import time
import json

logger = logging.getLogger('client-logger')
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s %(message)s', '%Y-%m-%d %H:%M:%SZ')
ch.setFormatter(formatter)
logger.addHandler(ch)

BACKEND_HOST = os.environ.get('BACKEND_HOST')
if not BACKEND_HOST:
    logger.error('BACKEND_HOST not set, exiting')
    sys.exit(1)

logger.info('Using {} as BACKEND_HOST'.format(BACKEND_HOST))

NETJSON_HOST = os.environ.get('NETJSON_HOST')
if not NETJSON_HOST:
    logger.error('NETJSON_HOST not set, exiting')
    sys.exit(1)

logger.info('Using {} as NETJSON_HOST'.format(NETJSON_HOST))

INTERVAL = float(os.environ.get('INTERVAL'))
if not INTERVAL:
    logger.info('INTERVAL not set, using default of 10 (seconds)')
    INTERVAL = 10.0
else:
    logger.info('INTERVAL set to {} (seconds)'.format(INTERVAL))

current_device = 1 # Hard coded for now, as we dont operate with more devices yet

def get_newest_config():
    fresh_config = requests.post(
                   'http://{}/configure'.format(BACKEND_HOST), 
                   headers={'Content-Type': 'application/json'}).json()['config']

    if next(iter(fresh_config)) == 'config': # API is not consistent
        fresh_config = fresh_config['config']

    return fresh_config


def send_config(config={}):
    """ 
    Initialize the device in the backend application. Sends the initial config
    of the device and writes the config to the database.
    """
    logger.info('Sending config to backend service')
    with open('gateway.properties', 'r+b') as f:
        current_config = Properties()
        current_config.load(f, 'ascii')

        for key in current_config:
            config[key] = current_config[key][0]

        r = requests.post(
            'http://{}/configure'.format(BACKEND_HOST), 
            headers={'Content-Type': 'application/json'},
            data = json.dumps({
                'device_id': current_device,
                'config': config
            })).json()
        f.close()


def fetch_graph_and_make_adaption():
    """
    Fetches a network collection schema and parses it. Gets the routing
    protocol of the first graph in the collection and executes an 
    arbitrary adaption based on it.
    """
    logger.info('Fetching network collection to look for changes')
    network_collection = requests.get('http://{}/netgph'.format(NETJSON_HOST)).json()
    current_routing_protocol = network_collection['collection'][0]['protocol']
    if len(current_routing_protocol) > 3: # Very arbitrary
        logger.info('Routing protocol has length > 3, setting waitingTime to 20')
        fresh_config = get_newest_config()
        fresh_config['waitingTime'] = 20
        send_config(fresh_config)


def send_log(device_id, adaption_type, description):
    """ 
    Sends a request to make a log entry with what adaption that
    has been made. NB! Will break if the requested adaption type
    is not present in the database
    """
    logger.info('Adding log entry for adaption')
    r = requests.post('http://{}/logadaption?adaption_type={}&device_id={}&description={}'.format(BACKEND_HOST, adaption_type, device_id, description))


def update_config_from_parameters():
    """ 
    Requests parameters from the API. If parameters for this device has changed
    since last time, it will write the changes to the MQTT config of OKSE, and 
    restart OKSEs daemon.
    """
    # OKSE stores configuration files in several jproperties-files. We can
    # load all of these, but for the purpose of demonstration, only gateway
    # properties are loaded - as these are relevant for performing adaptations
    # to MQTT 
    logger.info('Fetching newest config from backend service at {}'.format(BACKEND_HOST))
    fresh_config = get_newest_config()

    updated_params = []
    with open('gateway.properties', 'r+b') as f:
        current_config = Properties()
        current_config.load(f, 'ascii')
    
        for key in current_config:
            if current_config[key][0] != fresh_config[key]:
                logger.info("{} values differ, updating config".format(key))
                current_config[key] = fresh_config[key]
                updated_params.append(key)
            else:
                logger.info("{} values equal, skipping".format(key))
    
        f.seek(0)
        f.truncate(0)
        current_config.store(f, 'ascii') 
        f.close()

    if len(updated_params) > 0:
        logger.info('Config updated, sending log entry to backend service and restarting broker')
        send_log(current_device, 'param_update', 'Parameters updated: {}'.format(str(updated_params)))
        call(['systemctl', 'restart', 'okse.service'])


send_config()

while True:
    #update_config_from_parameters()
    fetch_graph_and_make_adaption()
    logger.info('Done, sleeping {} seconds'.format(str(INTERVAL)))
    time.sleep(INTERVAL)
