# Virtual image 
Url: `https://ibuprofen.samfundet.no/~yngvem/ntnu/skrp_deliverable.ova` Image
created and tested exclusively in VirtualBox 6.0 for debian 9.8.

# Image includes
- Backend API
- NetJson mocker
- Frontend

# Image does not include
- Okse broker
- Adaption client

# VM UI
The VM does not include an X-server and desktop environment. The only way to
interface with it is with a shell. This can either be done with ssh, or through
your preferred virtualization client.

Once VM is started you can ssh to it on port 3022 `ssh -p 3022 skrp@localhost`

Password is: fiskesuppe

The VM will also expose a webserver to port 7654, visit it in your browser
(outside the VM) at `http://localhost:7654`
