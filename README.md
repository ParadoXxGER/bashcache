### Bashcache

Bashcache is a command line tool to store key/value.

For example:

`curl -X PUT bashcache.com/foo/bar`

`curl bashcache.com/foo`

Creating a random key:

`curl -X PUT bashcache.com/$(openssl rand -hex 16)/bar`

`curl bashcache.com/2fdda2436ac9eb1de4c20a7de7cb192d`