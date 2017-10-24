# Bashcache
## A dead simple http key/value store.

## Setup:

1. Clone or fork this repo.
2. Run "docker-compose build"
3. Run "docker-compose up"
4. Try accessing via: `curl localhost:3000`

Note: Bashcache need redis to work properly
Note: Add Docker volumes to persist redis data

## Examples

Bashcache is a command line tool to store key/value. The content type will ever be text/html

For example:

`curl -X PUT localhost:3000/foo --data "bar"`

The following returns "bar":

`curl localhost:3000/foo`

Creating a random key:

`curl -X PUT localhost:3000/$(openssl rand -hex 16) --data "bar"`

`curl localhost:3000/2fdda2436ac9eb1de4c20a7de7cb192d`

Advanced examples:

You can upload a image to bashcache via console:

`curl -X PUT localhost:3000/$(openssl rand -hex 12) --data "<img src='data:image/png;base64,$(cat ~/Desktop/image.png | base64)'>"`

Upload a file:

`curl -X PUT localhost:3000/$(openssl rand -hex 12) --data "$(cat ~/Desktop/notes.txt)"`