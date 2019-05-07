# Virtual image 
Url: `https://ibuprofen.samfundet.no/~yngvem/ntnu/skrp_deliverable.ova` 

Image created and tested exclusively in VirtualBox 6.0 for debian 9.8.

# Image includes
- Backend API
- NetJson mocker
- Frontend
- Client
- Broker (OKSE)

# VM UI
The VM does not include an X-server and desktop environment. The only way to
interface with it is with a shell. This can either be done with ssh, or through
your preferred virtualization client.

Once VM is started you can ssh to it on port 3022 

`ssh -p 3022 skrp@localhost`

Password is: `fiskesuppe`. The password is the same for root.

The VM will also expose a webserver to port 7654, visit it in your browser
(outside the VM) at `http://localhost:7654`

## Setup & debug
The VM runs two systemd-services, a postgres database and an apache2 webserver.
Relevant files:

`/etc/systemd/system/skrp.service`

`/etc/systemd/system/mocker.service`

`/etc/systemd/system/okse.service`

`/etc/systemd/system/client.service`

`/etc/apache2/sites-availible/000-default.conf`

The frontend resides in /var/www/build and is served by apache.

## Starting and stopping services

`systemctl [stop|start|restart|reload|status] <some>.service`

## Accessing logs of the individual services

To get logs from a service you can do `journalctl -u <service>`
For instance, `journalctl -u skrp.service`

## Accessing database

From skrp user;

`psql -d netjson_dev`
