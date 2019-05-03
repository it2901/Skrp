import requests
import os
import sys
import logging
from subprocess import call
from jproperties import Properties

logger = logging.getLogger('client-logger')
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s %(message)s', '%Y-%m-%d %H:%M:%SZ')
ch.setFormatter(formatter)
logger.addHandler(ch)


hostname = os.environ.get('BACKEND_HOST')
if not hostname:
    logger.error('BACKEND_HOST not set, exiting')
    sys.exit(1)

logger.info('Fetching newest config from backend service at {}'.format(hostname))
r = requests.get("http://{}/config.json".format(hostname))
fresh_config = r.json()

# OKSE stores configuration files in several jproperties-files. We can
# load all of these, but for the purpose of demonstration, only gateway
# properties are loaded - as these are relevant for performing adaptations
with open('gateway.properties', 'r+b') as f:
    current_config = Properties()
    current_config.load(f, 'utf-8')
    
    for key in fresh_config:
        logger.info("Current config: {}: {}".format(key, current_config[key][0]))
        logger.info("Fresh config: {}: {}".format(key, str(fresh_config[key])))
        logger.info("Updating config")
        if str(current_config[key][0]) is not str(fresh_config[key]):
            current_config[key] = str(fresh_config[key])

    f.truncate(0)
    current_config.store(f, encoding="utf-8") 

# Uncomment me
#adaption_dict = {'device_id': 1, 'config': current_config}
#r = requests.post('http://{hostname}/api/adaption'.format(hostname), data=adaption_dict)

#print('Restarting OKSE with new configuration')
#call(['systemctl', 'restart okse.service']
