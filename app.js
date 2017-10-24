var app = require('express')();
var bodyParser = require('body-parser');
var Redis = require('ioredis');
var os = require('os');
var redis = new Redis(process.env.REDIS_URL);

app.use(bodyParser.text({ type: '*/*', limit: Infinity }));

app.use(function (req, res, next) {
    res.set('X-Backend-Host', os.hostname());
    next();
});

app.use(function (req, res, next){
    res.set("Content-type", "text/plain");
    next();
})

app.put('/:key', async function (req, res) {

    var key = req.params.key;

    if(Object.keys(req.body).length === 0){
        return res.status(400).send("Usage: curl -X PUT example.com/key --data 'value'\n")
    }

    var data = req.body;

    try {
        value = await redis.get(key);
    } catch (error) {
        console.log(error);
        return res.send("Oops, Internal Server error! \n");
    }

    value = JSON.parse(value);

    if (value === null) {
        value = { locked: false, data: "" }
    }

    if (value.locked === true) {
        return res.send("Oops, Resource is locked! \n");
    }

    value.data = data;

    redis.set(key, JSON.stringify(value));

    return res.send(key +':'+value.data+'\n');

});

app.lock('/:key', async function (req, res) {

    var key = req.params.key;

    try {
        value = await redis.get(key);
        value = JSON.parse(value);
    } catch (error) {
        console.log(error);
        return res.send("Oops, Internal Server error! \n");
    }

    if (value === null) {
        return res.send("Oops, Resource not found! \n");
    }

    if (value.locked === true) {
        return res.send("Oops, Resource is locked! \n");
    }

    value.locked = true;

    redis.set(key, JSON.stringify(value));

    return res.send("Resource locked! \n");

});

app.get('/:key', async function (req, res) {

    var key = req.params.key;

    try {
        value = await redis.get(key);
        value = JSON.parse(value);
    } catch (error) {
        console.log(error);
        return res.send("Oops, Internal Server error! \n");
    }

    if (value === null || !value) {
        return res.send("Oops, Resource not found! \n");
    }
    
    return res.send(value.data + '\n');

});

app.delete('/:key', async function (req, res) {
    
    var key = req.params.key;

    try {
        value = await redis.get(key);
        value = JSON.parse(value);
    } catch (error) {
        console.log(error);
        return res.send("Oops, Internal Server error! \n");
    }
    
    if (value === null) {
        return res.send("Oops, Resource not found! \n");
    }

    if (value.locked === true) {
        return res.send("Oops, Resource is locked! \n");
    }

    redis.del(key);

    return res.send("OK \n");
});

app.get('/', async function (req, res) {

    try {
        keys = await redis.dbsize();
        value = JSON.parse(value);
    } catch (error) {
        console.log(error);
        return res.send("Oops, Internal Server error! \n");
    }

    return res.send("Already "+keys+" keys cached!\n");
    
});

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});