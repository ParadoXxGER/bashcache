var app = require('express')();
var bodyParser = require('body-parser');

app.use(bodyParser.text({type: '*/*', limit: Infinity}));
var cache = {};

app.put('/:key', function(req, res) {

    var key = req.params.key;

    if(typeof cache[key] !== 'undefined' && cache[key].locked === true){
        return res.sendStatus(423)
    }

    var data = {
        "data": req.body,
        "locked": false
    }

    cache[key] = data;

    return res.send("bashcache.com/"+key+'\n');

});

app.lock('/:key', function(req, res) {

    if(typeof cache[req.params.key] === 'undefined'){
        return res.sendStatus(404);
    }

    if(cache[req.params.key].locked === true){
        return res.sendStatus(423);
    }

    cache[req.params.key].locked = true;

    res.sendStatus(200);
});

app.get('/:key', function(req, res) {
    
    var key = req.params.key;

    var data = cache[key].data

    if (typeof data === 'undefined'){
        return res.sendStatus(404);
    }

    res.set("Content-type", "text/html");

    return res.send(data+'\n');
    
});

app.get('/', function(req, res){
    return res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});