### Bashcache

Bashcache is a command line tool to store key/value. The content type will ever be text/html

For example:

`curl -X PUT bashcache.com/foo --data "bar"`

The following returns "bar":

`curl bashcache.com/foo`

Creating a random key:

`curl -X PUT bashcache.com/$(openssl rand -hex 16) --data "bar"`

`curl bashcache.com/2fdda2436ac9eb1de4c20a7de7cb192d`

Advanced examples:

You can upload a image to bashcache via console:

`curl -X PUT bashcache.com/$(openssl rand -hex 12) --data "<img src='data:image/png;base64,$(cat ~/Desktop/image.png | base64)'>"`

Upload a file:

`curl -X PUT bashcache.com/$(openssl rand -hex 12) --data "$(cat ~/Desktop/notes.txt)"`