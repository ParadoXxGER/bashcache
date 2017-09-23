var app = require('express')();
var bodyParser = require('body-parser');
var Redis = require('ioredis');
var redis = new Redis(6379, 'redis');
var os = require('os');
var swig  = require('swig');
var index = swig.compileFile(__dirname + '/index.html');

app.use(bodyParser.text({ type: '*/*', limit: Infinity }));

app.use(function (req, res, next) {
    res.set('X-Backend-Host', os.hostname());
    next();
});

app.put('/:key', function (req, res) {

    var key = req.params.key;

    redis.get(key).then(function (value) {

        value = JSON.parse(value);

        if (value === null) {
            value = { locked: false, data: "" }
        }

        if (value.locked === true) {
            return res.sendStatus(423)
        }

        value.data = req.body;

        redis.set(key, JSON.stringify(value));

        return res.send("bashcache.com/" + key + '\n');

    }).catch(function (error) {
        res.sendStatus(500);
    });

});

app.lock('/:key', function (req, res) {

    var key = req.params.key;

    redis.get(key).then(function (value) {

        value = JSON.parse(value);

        if (value === null) {
            return res.sendStatus(404);
        }

        if (value.locked === true) {
            return res.sendStatus(423)
        }

        value.locked = true;

        redis.set(key, JSON.stringify(value));

        return res.sendStatus(200);

    }).catch(function () {
        res.sendStatus(500);
    });

});

app.get('/:key', function (req, res) {

    var key = req.params.key;

    redis.get(key).then(function (value) {

        value = JSON.parse(value);

        if (value === null) {
            return res.sendStatus(404);
        }

        res.set("Content-type", "text/html");

        return res.send(value.data + '\n');

    }).catch(function () {
        res.sendStatus(500);
    });

});

app.delete('/:key', function (req, res) {
    var key = req.params.key;

    redis.get(key).then(function (value) {

        value = JSON.parse(value);

        if (value === null) {
            return res.sendStatus(404);
        }

        if (value.locked === true) {
            return res.sendStatus(423);
        }

        redis.del(key);

        res.set("Content-type", "text/html");

        return res.sendStatus(200);

    }).catch(function () {
        res.sendStatus(500);
    });
})

app.get('/', function (req, res) {


    redis.dbsize().then(function(keys){

        var output = index({
            "keys": keys,
        });

        res.set("Content-type", "text/html");

        return res.send(output);

    }).catch(function(error){

        var output = index({
            "keys": "Error 😥",
        });

        res.set("Content-type", "text/html");

        return res.send(output);
    })
    
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});